
// function to convert google user profile info into standard reTHINK user profile object

export function convertUserProfile(googleUserProfile) {

  googleUserProfile.userURL = 'user://google.com/' + googleUserProfile.email;

  if (!googleUserProfile.hasOwnProperty('preferred_username')) 
    googleUserProfile.preferred_username = googleUserProfile.email.split('@')[0];

  return googleUserProfile;
}
