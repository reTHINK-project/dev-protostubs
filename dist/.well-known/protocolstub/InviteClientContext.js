"use strict";

System.register(["sip.js"], function (_export, _context) {
  "use strict";

  var SIP, Session, C, InviteClientContext;
  return {
    setters: [function (_sipJs) {
      SIP = _sipJs.default;
    }],
    execute: function () {
      Session = SIP.Session;
      C = {
        STATUS_NULL: 0,
        STATUS_INVITE_SENT: 1,
        STATUS_1XX_RECEIVED: 2,
        STATUS_INVITE_RECEIVED: 3,
        STATUS_WAITING_FOR_ANSWER: 4,
        STATUS_ANSWERED: 5,
        STATUS_WAITING_FOR_PRACK: 6,
        STATUS_WAITING_FOR_ACK: 7,
        STATUS_CANCELED: 8,
        STATUS_TERMINATED: 9,
        STATUS_ANSWERED_WAITING_FOR_PRACK: 10,
        STATUS_EARLY_MEDIA: 11,
        STATUS_CONFIRMED: 12
      };

      InviteClientContext = function InviteClientContext(ua, target, options) {
        options = Object.create(Session.desugar(options));
        options.params = Object.create(options.params || Object.prototype);
        var extraHeaders = (options.extraHeaders || []).slice(); // Custom data to be sent either in INVITE or in ACK

        this.renderbody = options.renderbody || null;
        this.rendertype = options.rendertype || 'text/plain';
        this.sdp = options.sdp;
        options.params.from_tag = this.from_tag;
        /* Do not add ;ob in initial forming dialog requests if the registration over
         *  the current connection got a GRUU URI.
         */

        this.contact = ua.contact.toString({
          anonymous: this.anonymous,
          outbound: this.anonymous ? !ua.contact.temp_gruu : !ua.contact.pub_gruu
        });
        extraHeaders.push('Contact: ' + this.contact);
        extraHeaders.push('Allow: ' + SIP.UA.C.ALLOWED_METHODS.toString());

        if (ua.configuration.rel100 === SIP.C.supported.REQUIRED) {
          extraHeaders.push('Require: 100rel');
        }

        if (ua.configuration.replaces === SIP.C.supported.REQUIRED) {
          extraHeaders.push('Require: replaces');
        }

        extraHeaders.push('Content-Type: application/sdp');
        options.extraHeaders = extraHeaders;
        SIP.Utils.augment(this, SIP.ClientContext, [ua, SIP.C.INVITE, target, options]);
        SIP.Utils.augment(this, SIP.Session, []); // Check Session Status

        if (this.status !== C.STATUS_NULL) {
          throw new SIP.Exceptions.InvalidStateError(this.status);
        } // Session parameter initialization


        this.from_tag = SIP.Utils.newTag(); // OutgoingSession specific parameters

        this.isCanceled = false;
        this.received_100 = false;
        this.method = SIP.C.INVITE;
        this.receiveNonInviteResponse = this.receiveResponse;
        this.receiveResponse = this.receiveInviteResponse;
        this.logger = ua.getLogger('sip.inviteclientcontext');
        this.onInfo = options.onInfo;
      };

      InviteClientContext.prototype = {
        invite: function invite() {
          var self = this; //Save the session into the ua sessions collection.
          //Note: placing in constructor breaks call to request.cancel on close... User does not need this anyway

          this.ua.sessions[this.id] = this; //Note: due to the way Firefox handles gUM calls, it is recommended to make the gUM call at the app level
          // and hand sip.js a stream as the mediaHint

          if (self.isCanceled || self.status === C.STATUS_TERMINATED) {
            return;
          }

          self.hasOffer = true;
          self.request.body = this.sdp;
          self.status = C.STATUS_INVITE_SENT;
          self.send();
          return this;
        },
        hasDescription: function hasDescription(message) {
          return message.getHeader('Content-Type') === 'application/sdp' && !!message.body;
        },
        receiveInviteResponse: function receiveInviteResponse(response) {
          var cause,
              //localMedia,
          session = this,
              id = response.call_id + response.from_tag + response.to_tag,
              extraHeaders = [],
              options = {};

          if (this.status === C.STATUS_TERMINATED || response.method !== SIP.C.INVITE) {
            return;
          }

          if (this.dialog && response.status_code >= 200 && response.status_code <= 299) {
            if (id !== this.dialog.id.toString()) {
              if (!this.createDialog(response, 'UAC', true)) {
                return;
              }

              this.earlyDialogs[id].sendRequest(this, SIP.C.ACK, {
                body: SIP.Utils.generateFakeSDP(response.body)
              });
              this.earlyDialogs[id].sendRequest(this, SIP.C.BYE);
              /* NOTE: This fails because the forking proxy does not recognize that an unanswerable
               * leg (due to peerConnection limitations) has been answered first. If your forking
               * proxy does not hang up all unanswered branches on the first branch answered, remove this.
               */

              if (this.status !== C.STATUS_CONFIRMED) {
                this.failed(response, SIP.C.causes.WEBRTC_ERROR);
                this.terminated(response, SIP.C.causes.WEBRTC_ERROR);
              }

              return;
            } else if (this.status === C.STATUS_CONFIRMED) {
              this.sendRequest(SIP.C.ACK, {
                cseq: response.cseq
              });
              return;
            } else if (!this.hasAnswer) {
              // invite w/o sdp is waiting for callback
              //an invite with sdp must go on, and hasAnswer is true
              return;
            }
          }

          if (this.dialog && response.status_code < 200) {
            /*
              Early media has been set up with at least one other different branch,
              but a final 2xx response hasn't been received
            */
            if (this.dialog.pracked.indexOf(response.getHeader('rseq')) !== -1 || this.dialog.pracked[this.dialog.pracked.length - 1] >= response.getHeader('rseq') && this.dialog.pracked.length > 0) {
              return;
            }

            if (!this.earlyDialogs[id] && !this.createDialog(response, 'UAC', true)) {
              return;
            }

            if (this.earlyDialogs[id].pracked.indexOf(response.getHeader('rseq')) !== -1 || this.earlyDialogs[id].pracked[this.earlyDialogs[id].pracked.length - 1] >= response.getHeader('rseq') && this.earlyDialogs[id].pracked.length > 0) {
              return;
            }

            extraHeaders.push('RAck: ' + response.getHeader('rseq') + ' ' + response.getHeader('cseq'));
            this.earlyDialogs[id].pracked.push(response.getHeader('rseq'));
            this.earlyDialogs[id].sendRequest(this, SIP.C.PRACK, {
              extraHeaders: extraHeaders,
              body: SIP.Utils.generateFakeSDP(response.body)
            });
            return;
          } // Proceed to cancellation if the user requested.


          if (this.isCanceled) {
            if (response.status_code >= 100 && response.status_code < 200) {
              this.request.cancel(this.cancelReason, extraHeaders);
              this.canceled(null);
            } else if (response.status_code >= 200 && response.status_code < 299) {
              this.acceptAndTerminate(response);
              this.emit('bye', this.request);
            } else if (response.status_code >= 300) {
              cause = SIP.C.REASON_PHRASE[response.status_code] || SIP.C.causes.CANCELED;
              this.rejected(response, cause);
              this.failed(response, cause);
              this.terminated(response, cause);
            }

            return;
          }

          switch (true) {
            case /^100$/.test(response.status_code):
              this.received_100 = true;
              this.emit('progress', response);
              break;

            case /^1[0-9]{2}$/.test(response.status_code):
              // Do nothing with 1xx responses without To tag.
              if (!response.to_tag) {
                this.logger.warn('1xx response received without to tag');
                break;
              } // Create Early Dialog if 1XX comes with contact


              if (response.hasHeader('contact')) {
                // An error on dialog creation will fire 'failed' event
                if (!this.createDialog(response, 'UAC', true)) {
                  break;
                }
              }

              this.status = C.STATUS_1XX_RECEIVED;

              if (response.hasHeader('require') && response.getHeader('require').indexOf('100rel') !== -1) {
                // Do nothing if this.dialog is already confirmed
                if (this.dialog || !this.earlyDialogs[id]) {
                  break;
                }

                if (this.earlyDialogs[id].pracked.indexOf(response.getHeader('rseq')) !== -1 || this.earlyDialogs[id].pracked[this.earlyDialogs[id].pracked.length - 1] >= response.getHeader('rseq') && this.earlyDialogs[id].pracked.length > 0) {
                  return;
                }

                if (!this.hasDescription(response)) {
                  extraHeaders.push('RAck: ' + response.getHeader('rseq') + ' ' + response.getHeader('cseq'));
                  this.earlyDialogs[id].pracked.push(response.getHeader('rseq'));
                  this.earlyDialogs[id].sendRequest(this, SIP.C.PRACK, {
                    extraHeaders: extraHeaders
                  });
                  this.emit('progress', response);
                } else if (this.hasOffer) {
                  if (!this.createDialog(response, 'UAC')) {
                    break;
                  }

                  this.hasAnswer = true;
                  this.dialog.pracked.push(response.getHeader('rseq'));
                  extraHeaders.push('RAck: ' + response.getHeader('rseq') + ' ' + response.getHeader('cseq'));
                  session.sendRequest(SIP.C.PRACK, {
                    extraHeaders: extraHeaders,
                    receiveResponse: function receiveResponse() {}
                  });
                  session.status = C.STATUS_EARLY_MEDIA;
                  session.emit('progress', response);
                }
              } else {
                this.emit('progress', response);
              }

              break;

            case /^2[0-9]{2}$/.test(response.status_code):
              var cseq = this.request.cseq + ' ' + this.request.method;

              if (cseq !== response.getHeader('cseq')) {
                break;
              }

              if (this.status === C.STATUS_EARLY_MEDIA && this.dialog) {
                this.status = C.STATUS_CONFIRMED;
                options = {};

                if (this.renderbody) {
                  extraHeaders.push('Content-Type: ' + this.rendertype);
                  options.extraHeaders = extraHeaders;
                  options.body = this.renderbody;
                }

                options.cseq = response.cseq;
                this.sendRequest(SIP.C.ACK, options);
                this.accepted(response);
                break;
              } // Do nothing if this.dialog is already confirmed


              if (this.dialog) {
                break;
              }

              if (this.hasAnswer) {
                if (this.renderbody) {
                  extraHeaders.push('Content-Type: ' + session.rendertype);
                  options.extraHeaders = extraHeaders;
                  options.body = this.renderbody;
                }

                this.sendRequest(SIP.C.ACK, options);
              } else {
                if (!this.hasDescription(response)) {
                  this.acceptAndTerminate(response, 400, 'Missing session description');
                  this.failed(response, SIP.C.causes.BAD_MEDIA_DESCRIPTION);
                  break;
                }

                if (!this.createDialog(response, 'UAC')) {
                  break;
                }

                this.hasAnswer = true;
                var options = {}; //,localMedia;

                session.status = C.STATUS_CONFIRMED;

                if (session.renderbody) {
                  extraHeaders.push('Content-Type: ' + session.rendertype);
                  options.extraHeaders = extraHeaders;
                  options.body = session.renderbody;
                }

                options.cseq = response.cseq;
                session.sendRequest(SIP.C.ACK, options);
                session.accepted(response);
              }

              break;

            default:
              cause = SIP.Utils.sipErrorCause(response.status_code);
              this.rejected(response, cause);
              this.failed(response, cause);
              this.terminated(response, cause);
          }
        },
        cancel: function cancel(options) {
          options = options || {};
          options.extraHeaders = (options.extraHeaders || []).slice(); // Check Session Status

          if (this.status === C.STATUS_TERMINATED || this.status === C.STATUS_CONFIRMED) {
            throw new SIP.Exceptions.InvalidStateError(this.status);
          }

          this.logger.log('canceling RTCSession');
          var cancel_reason = SIP.Utils.getCancelReason(options.status_code, options.reason_phrase); // Check Session Status

          if (this.status === C.STATUS_NULL || this.status === C.STATUS_INVITE_SENT && !this.received_100) {
            this.isCanceled = true;
            this.cancelReason = cancel_reason;
          } else if (this.status === C.STATUS_INVITE_SENT || this.status === C.STATUS_1XX_RECEIVED || this.status === C.STATUS_EARLY_MEDIA) {
            this.request.cancel(cancel_reason, options.extraHeaders);
          }

          return this.canceled();
        },
        terminate: function terminate(options) {
          if (this.status === C.STATUS_TERMINATED) {
            return this;
          }

          if (this.status === C.STATUS_WAITING_FOR_ACK || this.status === C.STATUS_CONFIRMED) {
            this.bye(options);
          } else {
            this.cancel(options);
          }

          return this;
        },
        receiveRequest: function receiveRequest(request) {
          // ICC RECEIVE REQUEST
          // Reject CANCELs
          if (request.method === SIP.C.CANCEL) {// TODO; make this a switch when it gets added
          }

          if (request.method === SIP.C.ACK && this.status === C.STATUS_WAITING_FOR_ACK) {
            SIP.Timers.clearTimeout(this.timers.ackTimer);
            SIP.Timers.clearTimeout(this.timers.invite2xxTimer);
            this.status = C.STATUS_CONFIRMED;
            this.accepted();
          }

          return Session.prototype.receiveRequest.apply(this, [request]);
        },
        onTransportError: function onTransportError() {
          if (this.status !== C.STATUS_CONFIRMED && this.status !== C.STATUS_TERMINATED) {
            this.failed(null, SIP.C.causes.CONNECTION_ERROR);
          }
        },
        onRequestTimeout: function onRequestTimeout() {
          if (this.status === C.STATUS_CONFIRMED) {
            this.terminated(null, SIP.C.causes.REQUEST_TIMEOUT);
          } else if (this.status !== C.STATUS_TERMINATED) {
            this.failed(null, SIP.C.causes.REQUEST_TIMEOUT);
            this.terminated(null, SIP.C.causes.REQUEST_TIMEOUT);
          }
        }
      };

      _export("default", InviteClientContext);
    }
  };
});