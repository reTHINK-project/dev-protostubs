
// function to convert google user profile info into standard reTHINK user profile object

export function convertUserProfile(userProfile) {

  console.log('[FaceboolUserProfileConverter] ', userProfile );
  userProfile.userURL = 'user://facebook.com/' + userProfile.id;

  userProfile.picture = userProfile.picture.data.url;

  if (!userProfile.hasOwnProperty('preferred_username')) 
  userProfile.preferred_username = userProfile.id;

  return userProfile;
}

