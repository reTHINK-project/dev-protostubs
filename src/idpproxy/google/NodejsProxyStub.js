/**
* Identity Provider Proxy
*/

let idp = {

  /**
  * Function to validate an identity Assertion received
  * TODO add details of the implementation, and improve the implementation
  *
  * @param  {assertion}    Identity Assertion to be validated
  * @param  {origin}       Origin parameter that identifies the origin of the RTCPeerConnection
  * @return {Promise}      Returns a promise with the identity assertion validation result
  */
  validateAssertion: (assertion, origin) => {

    //TODO check the values with the hash received
    return new Promise(function(resolve,reject) {

      // atob may need to be required for nodejs
      // var atob = require('atob');
      let decodedContent = atob(assertion);
      let content = JSON.parse(decodedContent);

      let idTokenSplited = content.tokenID.split('.');

      let idToken = JSON.parse(atob(idTokenSplited[1]));

      resolve({identity: idToken.email, contents: idToken.nonce});

    });
  },

  /**
  * Function to generate an identity Assertion
  * TODO add details of the implementation, and improve implementation
  *
  * @param  {contents} The contents includes information about the identity received
  * @param  {origin} Origin parameter that identifies the origin of the RTCPeerConnection
  * @param  {usernameHint} optional usernameHint parameter
  * @return {Promise} returns a promise with an identity assertion
  */
  generateAssertion: (contents, origin, hint) => {

    return new Promise(function(resolve, reject) {

      //the hint field contains the information obtained after the user authentication
      // if the hint content is not present, then rejects the value with the URL to open the page to authenticate the user
      if (!hint) {

        // this is temporary
        reject({name: 'IdPLoginError', loginUrl: 'requestUrl'});
        //let url = "https://localhost/#state=state&code=4/14pwctKh8MOdl4vhf1Lo4sZfgZd-18gr5bgSmoXh-LU&access_token=ya29.Glv4A2T2lDWyQNZrMSQOAMWBtIVF2f1yYqVk6_vxXpNyQOpeYPeUm3lYDM5sWTwys-zM0xQlW0i7ItzqyCxCsJ7dcGl_yfaC4lxWMrNggLuKA_27mMA3BByYBNRJ&token_type=Bearer&expires_in=3600&id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImZkY2FhNjMyNDBlZDI4ZWFlMzgxZDE2NDNkNGNjOTM1NmRjMzk3ZWIifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiaWF0IjoxNDg3NjAxNTEzLCJleHAiOjE0ODc2MDUxMTMsImF0X2hhc2giOiJsWUVEYU9uZldoTWRGQmFCNlUtT3hnIiwiYXVkIjoiODA4MzI5NTY2MDEyLXRxcjhxb2gxMTE5NDJnZDJrZzAwN3QwczhmMjc3cm9pLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTExOTM0MjMzNjMyNTIwMDc3NzQzIiwiY19oYXNoIjoibXpXTWhMZ2xWYkZCbDUzOUcyc1FnZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJub25jZSI6Ik5EZ3NNVE13TERFc016UXNORGdzTVRNc05pdzVMRFF5TERFek5DdzNNaXd4TXpRc01qUTNMREV6TERFc01Td3hMRFVzTUN3ekxERXpNQ3d4TERFMUxEQXNORGdzTVRNd0xERXNNVEFzTWl3eE16QXNNU3d4TERBc01qSXpMREV3Tnl3eE16a3NNVFUxTERJd055d3hNaklzTWpRd0xESTBOaXd4TWpNc01UUXpMREV4TlN3eU16RXNNVGMwTERFd05TdzVNQ3d4TERFNU9Dd3hNakFzTkRFc01qRXhMREkwTkN3eU5EWXNNakV5TERreExEUXlMRGMyTERFME5Dd3hOaklzTVRZMExERXdNeXd5TVRFc01USTRMRElzTkRnc016SXNNVEkzTERFM09Td3lNallzTWpNekxESXdOaXd5TlRRc09UTXNNVFkxTERJd015dzBPU3cyTml3eE9Ea3NNalF6TERJeU1pdzRPQ3d5TVRVc01qTTBMRFUyTERFek9Dd3hNVFFzTVRVNUxERTNNU3d5TXpBc01UQTJMREU1Tnl3NE5Dd3hORGNzT1Rrc01UTXdMREl6TlN3eU1EZ3NPRFFzTWprc01UTTFMRFk0TERRMUxERTVPU3d6TkN3MU9Dd3lNRGNzT0RNc01qUXhMREl3TkN3eE5qWXNNalEwTERFNU5pd3hNamdzTml3eE1qVXNNVEk1TERJME9DdzRNU3czTERFME1Td3lNVE1zTVRjMUxEazFMRFV4TERrMUxESXpNQ3d4TURBc01UUTFMREUzT1N3eE9UUXNNVFU0TERZekxERTVNeXd4T0RJc01UTXNOU3d6TXl3eE1qSXNPRGdzTVRNd0xESXNNVGt4TERFek9Td3lNRGdzTWpNNUxERXlPU3d4TURFc01UVXlMREV5TERJeE1pd3hPU3czT0N3eE16a3NNak13TERRd0xERXhNaXd4TmpZc016UXNNak16TERRNUxERXhOU3cxT0N3eE1ERXNNalF4TERJd0xETXpMREUwTml3Mk5pdzVNQ3d4TXpjc01Ua3NNVFkzTERFMU1Dd3hOVElzTVRjM0xESTFNQ3d5TXprc01UYzVMRGMyTERVMUxERXlNQ3d4TWprc01UVTFMRE0zTERZNExERTJPQ3cxTVN3eU1qVXNNakE0TERFeE15d3lNU3d4TlN3eU15d3hNRGtzTVRneUxEQXNPREFzTVRVNUxERXlNQ3d4T0Rnc05EQXNOVEVzT0N3eE9URXNOaklzT0Rnc01qQXhMREV5TlN3eE1pdzFPQ3d4TmpVc016Z3NNVEVzT0RRc016QXNPVFFzT1RNc015d3lNRElzT0Rjc01URTVMRFU1TERFM05Dd3hNak1zTVRNc01USXdMREl3T0N3eU1ETXNNVEE1TERjeExESXlOeXc0TUN3eE1Td3hNemdzTVRRNUxERXpOU3d4T0Rjc09EVXNORGdzTVRneExEWTRMREUxTUN3ek9Td3lORFFzT0RRc01UQTRMREFzTVRZNUxERTVPU3d5TkRjc01USTRMREk1TERjeExESXlPU3d4T0N3eE16UXNNakV4TERFNU1pd3hNekVzTVRnMExEa3pMREl5Tnl3eU5ETXNNakl3TERJd05Td3hORGdzTVRJNExESXdPU3czTXl3MU9Dd3hPREVzTVRBd0xERXpMRFExTERZMUxERXlOQ3d6T1N3eE1EWXNNVFExTERJeU55d3hOVGtzT1Rjc01URTVMRGN4TERFNU1pd3hNemNzTkRrc01pd3pMREVzTUN3eCIsImVtYWlsIjoib3BlbmlkdGVzdDEwQGdtYWlsLmNvbSJ9.A1H7kytmjmZc9nIc5C674CL_eDlz_13YLefpDLCrOClefat_G5aCW8ovE-vaSycef7rYA1ZxJt0qP1pvLP9k9mdSywUXUuH4zmsYD0khPAHVMLiSYeclbbZU2uSogeKcG7BjK6p1F3wRtujkYKn0QpKOwF-XSITcsUuIDayALFPc1x5LHjAtYkKU0Y07TiFyZiVjrC-eZB6DLJJBCie3E2q1b6pW8KnwI9VyzXF-MwG5DY83amwJ3SauKZZluu4565Z9stWp-vLJK6IUJKoHWOxGdDXdzNhP9uGRj8wSvgB_RZnPOtboJm9G0oLv_2qt-L3r1MajE8a8K25K2H2Uew&authuser=1&session_state=9ca3ec2bd24fdecb95d683dc6f58ac9f6d9a62f3..4f00&prompt=none";
        //resolve(url);
      } else {

        let assertion = "eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkltWmtZMkZoTmpNeU5EQmxaREk0WldGbE16Z3haREUyTkROa05HTmpPVE0xTm1Sak16azNaV0lpZlEuZXlKcGMzTWlPaUpvZEhSd2N6b3ZMMkZqWTI5MWJuUnpMbWR2YjJkc1pTNWpiMjBpTENKcFlYUWlPakUwT0RjMk1UQTNOemdzSW1WNGNDSTZNVFE0TnpZeE5ETTNPQ3dpWVhSZmFHRnphQ0k2SWtzMlQxRTRjMUp0TmpCdU4zUkdXbkZ3YTJkQ1RtY2lMQ0poZFdRaU9pSTRNRGd6TWprMU5qWXdNVEl0ZEhGeU9IRnZhREV4TVRrME1tZGtNbXRuTURBM2REQnpPR1l5TnpkeWIya3VZWEJ3Y3k1bmIyOW5iR1YxYzJWeVkyOXVkR1Z1ZEM1amIyMGlMQ0p6ZFdJaU9pSXhNVEU1TXpReU16TTJNekkxTWpBd056YzNORE1pTENKbGJXRnBiRjkyWlhKcFptbGxaQ0k2ZEhKMVpTd2lZWHB3SWpvaU9EQTRNekk1TlRZMk1ERXlMWFJ4Y2poeGIyZ3hNVEU1TkRKblpESnJaekF3TjNRd2N6aG1NamMzY205cExtRndjSE11WjI5dloyeGxkWE5sY21OdmJuUmxiblF1WTI5dElpd2libTl1WTJVaU9pSk9SR2R6VFZSTmQweEVSWE5OZWxGelRrUm5jMDFVVFhOT2FYYzFURVJSZVV4RVJYcE9RM2N6VFdsM2VFMTZVWE5OYWxFelRFUkZla3hFUlhOTlUzZDRURVJWYzAxRGQzcE1SRVY2VFVOM2VFeEVSVEZNUkVGelRrUm5jMDFVVFhkTVJFVnpUVlJCYzAxcGQzaE5la0Z6VFZOM2VFeEVRWE5OYWxWNVRFUkpNRXhFUlhwUFEzZDRUVlJGYzAxVVVUVk1SR00xVEVSTk1FeEVTWGxPUTNkNFRsUlJjMDFVVVhkTVJFbHpUV3BKZUV4RVJUVk1SRVUwVFVOM2VFOVVVWE5PZVhkNVRYcEZjMDFVVFRSTVJGRTFURVJGZVU5VGR6Qk5lWGQ0VDFOM2VVMXFSWE5OVkVrelRFUkpNVTFwZDNsUFUzY3lUbE4zTWs1NWQzaFBWRkZ6VFZSQmVFeEVUWGhNUkVWNlRVTjNlVTE2VVhOTlZHdDNURVJKYzAxcVRYbE1SRVV6VDBOM2VFNVVTWE5OYWtFeFRFUnJNRXhFU1hsT1EzZDVUWGwzZVUxNmEzTk5WR2N4VEVSRmVVeEVSWGRPZVhkNFRXbDNlVTFVUVhOT1JFbHpUWHBuYzAxVVl6Uk1SRWw2VFdsM2VVMVVWWE5OVkdkelRXcFZNRXhFU1RCUFUzZDVUWHBOYzAxcVRUSk1SRWt3VFZOM2VFMUVaM05OZWsxelRWUlpla3hFU1RCTlEzY3pUa04zZUU1RVVYTk5WRkZ6VGxSUmMwMVVhelJNUkVVeFRFUlJNRXhFUlRWUFEzYzBUVk4zTkU5VGQzaE9WRmx6VGxSamMwMVVVVEZNUkVrd1RsTjNlRTFFV1hOTlZGVTFURVJGZDA5VGQzaE9VM2Q0VGxSRmMwMVVSVEZNUkdNeVRFUkZkMDFUZDNoTlZHZHpUVlJaTVV4RVJYZFBRM2N5VFhsM2VFOVVXWE5OYWtrelRFUkZNazE1ZDNoUFZFRnpUVlJyZVV4RVJUUk5lWGQ0VFdwUmMwMVVTVEZNUkVVelQwTjNNVTVwZDNwTmFYYzFUbE4zTWs5RGR6Vk5lWGN5VDBOM01VMURkekJPZVhkNVRWUmpjMDE2U1hOTmFtdHpUbFJWYzAxVVFUQk1SRVUxVDBOM05VNURkM2hQVkdkelRWUmpjMDFxVVRCTVJFVjNUbmwzZVUxRVFYTk5WRTB6VEVSTk1FeEVSVFJOUTNkNFQwUnJjMDE1ZDNoUFZHdHpUVU4zZVUxNlFYTk5WRkUwVEVSSmQwMXBkM2hOZW10elRWUk5lRXhFUlRGUFUzZDRUWHBaYzAxVVdUQk1SRkUxVEVSRmVFNVRkM2hOZWtGelQwUkpjMDFxUVRSTVJFVTBUbE4zZVUxNlVYTk5ha1Y0VEVSRmVFNVRkM2xOYWxselRsUkJjMDFVUlhsTVJHZDVURVJKZDA1NWQzbE5WRWx6VG5wQmMwOVVhM05PYWtselRsUnJjMDU2YTNOT1JHdHpUVlJWTUV4RVJURk5lWGQ0VGtSUmMwMXFRWHBNUkVVMFRubDNlVTVFU1hOTlZGVXdURVJKTTB4RWF6Vk1SRVV5VGxOM2VFOVVRWE5OVkUxNlRFUkZNMDVEZDNsTmFrRnpUVlJKTVV4RVdYbE1SRVV4VDBOM2VVNVVSWE5OYWxFMVRFUlJNVXhFUlRGTlUzYzBUV2wzZVUxRWEzTk5WR3MxVEVSWk5VeEVaekpNUkVVMFRtbDNkMHhFUlhkTVJFVjRUbWwzZUUxVVNYTk5WR3Q0VEVSUk1reEVSWGhOUTNkNVRsTjNNRTlUZHpGTmVYY3hUV2wzZVUxRVNYTk5WRWt3VEVSSmVVNURkM2hQVkUxelRWUlpjMDFxVlhoTVJFVTBUbE4zZVUxNlZYTk5hazB5VEVSRk1VOURkM2xOVkd0elRtcFJjMDVVVFhOTlZHZDRURVJGTkU1VGQzaFBSRlZ6VFdwRmVVeEVhekJNUkVWNVRrTjNlRTE2VVhOTmFrMHhURVJGZVUxRGR6Vk9lWGQ0VFVScmMwMVVUWGRNUkVVeFQxTjNlVTVFUlhOTlZGVXhURVJWZVV4RVNYaFBRM2Q1VGtSSmMwMXFSWHBNUkUxelRWUkpkMHhFUlRGT1UzZDVUV3BGYzAxcVNUTk1SRlV6VEVSSk1reEVZek5NUkUxNlRFUm5la3hFU1hkTlUzYzFUWGwzZVUxcVZYTk9WRWx6VDBSVmMwMVVaM2RNUkVWNlRYbDNlRTE2WjNOT2VrbHpUV3BSZVV4RVNYbE5hWGQ1VGtSamMwOVVWWE5OVkdNelRFUkplVTU1ZDNoUFJGRnpUV3BOTlV4RVJYZE9hWGQ0VGtSVmMwMVVXVE5NUkVWNlRYbDNNVTE1ZDNsTVJFMXpUVk4zZDB4RVJUMGlMQ0psYldGcGJDSTZJbTl3Wlc1cFpIUmxjM1F4TUVCbmJXRnBiQzVqYjIwaWZRLlVOclFDeV91ckpFZXI3NS1JcVpucGhUNDhFeGtHMk9qUUxsTFRtY1RGTHlNZTd4X2tuWG5OSWFQTlJiTXFSaVY0ZE1xNjE2bXlXdEpvYlVwSVNiSnFaTC1mM09jb3I1LTc3cjVXRS1WV2U5RDlfNzRWbXRQamV2ZHI3dkpENlZRLTUyWlh4Wm1MeDdTc2dRWkt4UmJxSG44bzdEZ3ZhQ0tvWDlPS3IwWVB0OGRWa1E1VnpjRW50NkRkV1h1UUZrUVJUWUFLSXFvcnBBSm5veXZVR0lJNkFWTmZucmZVVk5oa0pHVzZHZGNKb1BCdkNDbXoxR0d0VWlITERSUDhPcDhnVlNkVkxZSnZxTG9KQjhvX0hxUTJWNlNjd1piQmVDMmpLVWdfWXZfd1d0OVJReXpwQW9lR3UtUlZ0R1B2ckdFYUVBdklFWHk3c1ZMaWNHMHluVXVXdyIsInRva2VuSURKU09OIjp7ImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE0ODc2MTA3NzgiLCJleHAiOiIxNDg3NjE0Mzc4IiwiYXRfaGFzaCI6Iks2T1E4c1JtNjBuN3RGWnFwa2dCTmciLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MzQyMzM2MzI1MjAwNzc3NDMiLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJub25jZSI6Ik5EZ3NNVE13TERFc016UXNORGdzTVRNc05pdzVMRFF5TERFek5DdzNNaXd4TXpRc01qUTNMREV6TERFc01Td3hMRFVzTUN3ekxERXpNQ3d4TERFMUxEQXNORGdzTVRNd0xERXNNVEFzTWl3eE16QXNNU3d4TERBc01qVXlMREkwTERFek9Dd3hNVEVzTVRRNUxEYzVMRE0wTERJeU5Dd3hOVFFzTVRRd0xESXNNakl4TERFNUxERTRNQ3d4T1RRc055d3lNekVzTVRNNExEUTVMREV5T1N3ME15d3hPU3d5TWpFc01USTNMREkxTWl3eU9TdzJOU3cyTnl3eE9UUXNNVEF4TERNeExERXpNQ3d5TXpRc01Ua3dMRElzTWpNeUxERTNPQ3d4TlRJc01qQTFMRGswTERJeU5Dd3lNeXd5TXprc01UZzFMREV5TERFd055d3hNaXd5TVRBc05ESXNNemdzTVRjNExESXpNaXd5TVRVc01UZ3NNalUwTERJME9Td3lNek1zTWpNMkxESTBNU3d4TURnc016TXNNVFl6TERJME1DdzNOQ3d4TkRRc01UUXNOVFFzTVRrNExERTFMRFEwTERFNU9DdzRNU3c0T1N3eE5UWXNOVGNzTVRRMUxESTBOU3d4TURZc01UVTVMREV3T1N3eE5Td3hOVEVzTVRFMUxEYzJMREV3TVN3eE1UZ3NNVFkxTERFd09DdzJNeXd4T1RZc01qSTNMREUyTXl3eE9UQXNNVGt5TERFNE15d3hNalFzTVRJMUxERTNPQ3cxTml3ek1pdzVOU3cyT0N3NU15dzJPQ3cxTUN3ME55d3lNVGNzTXpJc01qa3NOVFVzTVRBMExERTVPQ3c1TkN3eE9UZ3NNVGNzTWpRMExERXdOeXd5TURBc01UTTNMRE0wTERFNE1Dd3hPRGtzTXl3eE9Ua3NNQ3d5TXpBc01UUTRMREl3TWl3eE16a3NNVE14TERFMU9Td3hNellzTVRZMExEUTVMREV4TlN3eE16QXNPRElzTWpBNExERTROU3d5TXpRc01qRXhMREV4TlN3eU1qWXNOVEFzTVRFeUxEZ3lMREl3Tnl3eU1USXNOekFzT1Rrc05qSXNOVGtzTnprc05Ea3NNVFUwTERFMU15d3hORFFzTWpBekxERTROeXd5TkRJc01UVTBMREkzTERrNUxERTJOU3d4T1RBc01UTXpMREUzTkN3eU1qQXNNVEkxTERZeUxERTFPQ3d5TlRFc01qUTVMRFExTERFMU1TdzRNaXd5TURrc01UazVMRFk1TERnMkxERTROaXd3TERFd0xERXhOaXd4TVRJc01Ua3hMRFEyTERFeE1Dd3lOU3cwT1N3MU15dzFNaXd5TURJc01USTBMREl5TkN3eE9UTXNNVFlzTWpVeExERTROU3d5TXpVc01qTTJMREUxT0N3eU1Ua3NOalFzTlRNc01UZ3hMREU0TlN3eE9EVXNNakV5TERrMExERXlOQ3d4TXpRc01qTTFMREV5TUN3NU55d3hNRGtzTVRNd0xERTFPU3d5TkRFc01UVTFMRFV5TERJeE9Dd3lORElzTWpFekxETXNNVEl3TERFMU5Td3lNakVzTWpJM0xEVTNMREkyTERjM0xETXpMRGd6TERJd01TdzVNeXd5TWpVc05USXNPRFVzTVRnd0xERXpNeXd4TXpnc056SXNNalF5TERJeU1pd3lORGNzT1RVc01UYzNMREl5Tnl3eE9EUXNNak01TERFd05pd3hORFVzTVRZM0xERXpNeXcxTXl3eUxETXNNU3d3TERFPSIsImVtYWlsIjoib3BlbmlkdGVzdDEwQGdtYWlsLmNvbSIsImFsZyI6IlJTMjU2Iiwia2lkIjoiZmRjYWE2MzI0MGVkMjhlYWUzODFkMTY0M2Q0Y2M5MzU2ZGMzOTdlYiJ9fQ==";
        let idpBundle = {domain:'google.com',protocol:'OIDC'};
        let identityBundle = {"accessToken":"ya29.Glv4A1n_HScRBNtT_OEq6o6B_VHbp-1cJqtr-97kTa40ejpqG0fTbAhtrMlajVkYLF33QtcxQATfZwVqaun7LXo-7-4ItL5FCMC3m9VwRJ8SD3SrbMoQ__Kc8V6h","idToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImZkY2FhNjMyNDBlZDI4ZWFlMzgxZDE2NDNkNGNjOTM1NmRjMzk3ZWIifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0ODc2MTA3NzgsImV4cCI6MTQ4NzYxNDM3OCwiYXRfaGFzaCI6Iks2T1E4c1JtNjBuN3RGWnFwa2dCTmciLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MzQyMzM2MzI1MjAwNzc3NDMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiODA4MzI5NTY2MDEyLXRxcjhxb2gxMTE5NDJnZDJrZzAwN3QwczhmMjc3cm9pLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNalV5TERJMExERXpPQ3d4TVRFc01UUTVMRGM1TERNMExESXlOQ3d4TlRRc01UUXdMRElzTWpJeExERTVMREU0TUN3eE9UUXNOeXd5TXpFc01UTTRMRFE1TERFeU9TdzBNeXd4T1N3eU1qRXNNVEkzTERJMU1pd3lPU3cyTlN3Mk55d3hPVFFzTVRBeExETXhMREV6TUN3eU16UXNNVGt3TERJc01qTXlMREUzT0N3eE5USXNNakExTERrMExESXlOQ3d5TXl3eU16a3NNVGcxTERFeUxERXdOeXd4TWl3eU1UQXNORElzTXpnc01UYzRMREl6TWl3eU1UVXNNVGdzTWpVMExESTBPU3d5TXpNc01qTTJMREkwTVN3eE1EZ3NNek1zTVRZekxESTBNQ3czTkN3eE5EUXNNVFFzTlRRc01UazRMREUxTERRMExERTVPQ3c0TVN3NE9Td3hOVFlzTlRjc01UUTFMREkwTlN3eE1EWXNNVFU1TERFd09Td3hOU3d4TlRFc01URTFMRGMyTERFd01Td3hNVGdzTVRZMUxERXdPQ3cyTXl3eE9UWXNNakkzTERFMk15d3hPVEFzTVRreUxERTRNeXd4TWpRc01USTFMREUzT0N3MU5pd3pNaXc1TlN3Mk9DdzVNeXcyT0N3MU1DdzBOeXd5TVRjc016SXNNamtzTlRVc01UQTBMREU1T0N3NU5Dd3hPVGdzTVRjc01qUTBMREV3Tnl3eU1EQXNNVE0zTERNMExERTRNQ3d4T0Rrc015d3hPVGtzTUN3eU16QXNNVFE0TERJd01pd3hNemtzTVRNeExERTFPU3d4TXpZc01UWTBMRFE1TERFeE5Td3hNekFzT0RJc01qQTRMREU0TlN3eU16UXNNakV4TERFeE5Td3lNallzTlRBc01URXlMRGd5TERJd055d3lNVElzTnpBc09Ua3NOaklzTlRrc056a3NORGtzTVRVMExERTFNeXd4TkRRc01qQXpMREU0Tnl3eU5ESXNNVFUwTERJM0xEazVMREUyTlN3eE9UQXNNVE16TERFM05Dd3lNakFzTVRJMUxEWXlMREUxT0N3eU5URXNNalE1TERRMUxERTFNU3c0TWl3eU1Ea3NNVGs1TERZNUxEZzJMREU0Tml3d0xERXdMREV4Tml3eE1USXNNVGt4TERRMkxERXhNQ3d5TlN3ME9TdzFNeXcxTWl3eU1ESXNNVEkwTERJeU5Dd3hPVE1zTVRZc01qVXhMREU0TlN3eU16VXNNak0yTERFMU9Dd3lNVGtzTmpRc05UTXNNVGd4TERFNE5Td3hPRFVzTWpFeUxEazBMREV5TkN3eE16UXNNak0xTERFeU1DdzVOeXd4TURrc01UTXdMREUxT1N3eU5ERXNNVFUxTERVeUxESXhPQ3d5TkRJc01qRXpMRE1zTVRJd0xERTFOU3d5TWpFc01qSTNMRFUzTERJMkxEYzNMRE16TERnekxESXdNU3c1TXl3eU1qVXNOVElzT0RVc01UZ3dMREV6TXl3eE16Z3NOeklzTWpReUxESXlNaXd5TkRjc09UVXNNVGMzTERJeU55d3hPRFFzTWpNNUxERXdOaXd4TkRVc01UWTNMREV6TXl3MU15d3lMRE1zTVN3d0xERT0iLCJlbWFpbCI6Im9wZW5pZHRlc3QxMEBnbWFpbC5jb20ifQ.UNrQCy_urJEer75-IqZnphT48ExkG2OjQLlLTmcTFLyMe7x_knXnNIaPNRbMqRiV4dMq616myWtJobUpISbJqZL-f3Ocor5-77r5WE-VWe9D9_74VmtPjevdr7vJD6VQ-52ZXxZmLx7SsgQZKxRbqHn8o7DgvaCKoX9OKr0YPt8dVkQ5VzcEnt6DdWXuQFkQRTYAKIqorpAJnoyvUGII6AVNfnrfUVNhkJGW6GdcJoPBvCCmz1GGtUiHLDRP8Op8gVSdVLYJvqLoJB8o_HqQ2V6ScwZbBeC2jKUg_Yv_wWt9RQyzpAoeGu-RVtGPvrGEaEAvIEXy7sVLicG0ynUuWw","tokenType":"Bearer","infoToken":{"sub":"111934233632520077743","name":"test OpenID","given_name":"test","family_name":"OpenID","picture":"https://lh3.googleusercontent.com/-WaCrjVMMV-Q/AAAAAAAAAAI/AAAAAAAAAAs/8OlVqCpSB9c/photo.jpg","email":"openidtest10@gmail.com","email_verified":true,"locale":"en-GB"},"tokenIDJSON":{"iss":"https://accounts.google.com","iat":"1487610778","exp":"1487614378","at_hash":"K6OQ8sRm60n7tFZqpkgBNg","aud":"808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com","sub":"111934233632520077743","email_verified":"true","azp":"808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com","nonce":"NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMjUyLDI0LDEzOCwxMTEsMTQ5LDc5LDM0LDIyNCwxNTQsMTQwLDIsMjIxLDE5LDE4MCwxOTQsNywyMzEsMTM4LDQ5LDEyOSw0MywxOSwyMjEsMTI3LDI1MiwyOSw2NSw2NywxOTQsMTAxLDMxLDEzMCwyMzQsMTkwLDIsMjMyLDE3OCwxNTIsMjA1LDk0LDIyNCwyMywyMzksMTg1LDEyLDEwNywxMiwyMTAsNDIsMzgsMTc4LDIzMiwyMTUsMTgsMjU0LDI0OSwyMzMsMjM2LDI0MSwxMDgsMzMsMTYzLDI0MCw3NCwxNDQsMTQsNTQsMTk4LDE1LDQ0LDE5OCw4MSw4OSwxNTYsNTcsMTQ1LDI0NSwxMDYsMTU5LDEwOSwxNSwxNTEsMTE1LDc2LDEwMSwxMTgsMTY1LDEwOCw2MywxOTYsMjI3LDE2MywxOTAsMTkyLDE4MywxMjQsMTI1LDE3OCw1NiwzMiw5NSw2OCw5Myw2OCw1MCw0NywyMTcsMzIsMjksNTUsMTA0LDE5OCw5NCwxOTgsMTcsMjQ0LDEwNywyMDAsMTM3LDM0LDE4MCwxODksMywxOTksMCwyMzAsMTQ4LDIwMiwxMzksMTMxLDE1OSwxMzYsMTY0LDQ5LDExNSwxMzAsODIsMjA4LDE4NSwyMzQsMjExLDExNSwyMjYsNTAsMTEyLDgyLDIwNywyMTIsNzAsOTksNjIsNTksNzksNDksMTU0LDE1MywxNDQsMjAzLDE4NywyNDIsMTU0LDI3LDk5LDE2NSwxOTAsMTMzLDE3NCwyMjAsMTI1LDYyLDE1OCwyNTEsMjQ5LDQ1LDE1MSw4MiwyMDksMTk5LDY5LDg2LDE4NiwwLDEwLDExNiwxMTIsMTkxLDQ2LDExMCwyNSw0OSw1Myw1MiwyMDIsMTI0LDIyNCwxOTMsMTYsMjUxLDE4NSwyMzUsMjM2LDE1OCwyMTksNjQsNTMsMTgxLDE4NSwxODUsMjEyLDk0LDEyNCwxMzQsMjM1LDEyMCw5NywxMDksMTMwLDE1OSwyNDEsMTU1LDUyLDIxOCwyNDIsMjEzLDMsMTIwLDE1NSwyMjEsMjI3LDU3LDI2LDc3LDMzLDgzLDIwMSw5MywyMjUsNTIsODUsMTgwLDEzMywxMzgsNzIsMjQyLDIyMiwyNDcsOTUsMTc3LDIyNywxODQsMjM5LDEwNiwxNDUsMTY3LDEzMyw1MywyLDMsMSwwLDE=","email":"openidtest10@gmail.com","alg":"RS256","kid":"fdcaa63240ed28eae381d1643d4cc9356dc397eb"},"expires":"1487614378","email":"openidtest10@gmail.com"};
        let infoToken = {"sub":"111934233632520077743","name":"test OpenID","given_name":"test","family_name":"OpenID","picture":"https://lh3.googleusercontent.com/-WaCrjVMMV-Q/AAAAAAAAAAI/AAAAAAAAAAs/8OlVqCpSB9c/photo.jpg","email":"openidtest10@gmail.com","email_verified":true,"locale":"en-GB"};

        resolve({assertion: assertion, idp: idpBundle, info: identityBundle, infoToken: infoToken});

      }
    });
  }
};

/**
* Identity Provider Proxy Protocol Stub
*/
class NodejsProxyStub {

  /**
  * Constructor of the IdpProxy Stub
  * The constructor add a listener in the messageBus received and start a web worker with the received idpProxy
  *
  * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
  * @param  {Message.Message}                           busPostMessage     configuration
  * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
  */
 constructor(runtimeProtoStubURL, bus, config) {
   let _this = this;
   _this.runtimeProtoStubURL = runtimeProtoStubURL;
   _this.messageBus = bus;
   _this.config = config;

   _this.messageBus.addListener('*', function(msg) {

     //TODO add the respective listener
     if (msg.to === 'domain-idp://google.com') {

        _this.requestToIdp(msg);
     }
   });
 }

  /**
  * Function that see the intended method in the message received and call the respective function
  *
  * @param {message}  message received in the messageBus
  */
  requestToIdp(msg) {
    let _this = this;
    let params = msg.body.params;

    switch (msg.body.method) {
      case 'generateAssertion':
        idp.generateAssertion(params.contents, params.origin, params.usernameHint).then(
          function(value) { _this.replyMessage(msg, value);},

          function(error) { _this.replyMessage(msg, error);}
        );
        break;
      case 'validateAssertion':
        idp.validateAssertion(params.assertion, params.origin).then(
          function(value) { _this.replyMessage(msg, value);},

          function(error) { _this.replyMessage(msg, error);}
        );
        break;
      default:
        break;
    }
  }

  /**
  * This function receives a message and a value. It replies the value to the sender of the message received
  *
  * @param  {message}   message received
  * @param  {value}     value to include in the new message to send
  */
  replyMessage(msg, value) {
    let _this = this;

    let message = {id: msg.id, type: 'response', to: msg.from, from: msg.to,
                   body: {code: 200, value: value}};

    _this.messageBus.postMessage(message);
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
    name: 'NodejsProxyStub',
    instance: new NodejsProxyStub(url, bus, config)
  };
}
