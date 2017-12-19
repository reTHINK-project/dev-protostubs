
// function to convert google user profile info into standard reTHINK user profile object

export function convertUserProfile(googleUserProfile) {

  googleUserProfile.userURL = 'user://google.com/' + googleUserProfile.email;
  return googleUserProfile;
}
