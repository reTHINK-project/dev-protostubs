let domain = 'rethink-project.eu'

/**
 * Identity Provider Proxy Protocol Stub
 */
class IMSIWProxyStub {

	/**
	 * Constructor of the IdpProxy Stub
	 * The constructor add a listener in the messageBus received and start a web worker with the received idpProxy
	 *
	 * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
	 * @param  {Message.Message}                           busPostMessage     configuration
	 * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
	 */
	constructor(runtimeProtoStubURL, bus, config) {
		this.runtimeProtoStubURL = runtimeProtoStubURL
		this.messageBus = bus
		this.config = config

		this.messageBus.addListener('*', msg => {
			//TODO add the respective listener
			if (msg.to === `domain-idp://${domain}`) {
				this.requestToIdp(msg)
			}
		})
	}

	/**
	 * Function that see the intended method in the message received and call the respective function
	 *
	 * @param {message}  message received in the messageBus
	 */
	requestToIdp(msg) {
		let params = msg.body.params

		switch (msg.body.method) {
		case 'generateAssertion':
			this.generateAssertion(params.contents, params.origin, params.usernameHint)
				.then(value => this.replyMessage(msg, value))
				.catch(error => this.replyMessage(msg, error))
			break
		case 'validateAssertion':
			this.replyMessage(msg, {identity: 'identity@idp.com', contents: 'content'})
			break
		default:
			break
		}
	}

	generateAssertion (contents, origin, hint)  {

		console.log('contents->', contents)
		console.log('origin->', origin)
		console.log('hint->', hint)

		return new Promise((resolve, reject) => {

			//the hint field contains the information obtained after the user authentication
			// if the hint content is not present, then rejects the value with the URL to open the page to authenticate the user
			if (!hint) {
				let requestUrl =`https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&state=%2Fprofile&redirect_uri=${location.protocol}//${location.hostname}&response_type=token&client_id=808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com`
				console.log('first url ', requestUrl, 'done')
				reject({name: 'IdPLoginError', loginUrl: requestUrl})
			} else {
				let accessToken = this._urlParser(hint, 'access_token')
				let expires = Math.floor(Date.now() / 1000) + this._urlParser(hint, 'expires_in')
				fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`)
					.then(res_user => res_user.json())
					.then(body => {
						let infoToken = {picture: body.picture, email: body.email, family_name: body.family_name, given_name: body.given_name}
						let assertion = btoa(JSON.stringify({tokenID: accessToken, email: body.email, id: body.id}))
						let toResolve = {info: { expires: expires }, assertion: assertion, idp: {domain: domain, protocol: 'OAuth 2.0'}, infoToken: infoToken, interworking: {access_token: accessToken, domain: domain }}
						console.log('RESOLVING THIS OBJECT', toResolve)
						resolve(toResolve)
					}).catch(reject)
			}
		})
	}

	_urlParser(url, name) {
		name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
		let regexS = '[\\#&?]' + name + '=([^&#]*)'
		let regex = new RegExp(regexS)
		let results = regex.exec(url)
		if (results === null)
			return ''
		else
			return results[1]
	}

	/**
	 * This function receives a message and a value. It replies the value to the sender of the message received
	 *
	 * @param  {message}   message received
	 * @param  {value}     value to include in the new message to send
	 */
	replyMessage(msg, value) {
		let message = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: {code: 200, value: value}}

		this.messageBus.postMessage(message)
	}
}

/**
 * To activate this protocol stub, using the same method for all protostub.
 * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
 * @param  {Message.Message}                           busPostMessage     configuration
 * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
 * @return {Object} Object with name and instance of ProtoStub
 */
export default function activate(url, bus, config) {
	return {
		name: 'IMSIWProxyStub',
		instance: new IMSIWProxyStub(url, bus, config)
	}
}

