const theuser = document.getElementById("userset").dataset.user;
export default theuser;
export const { id, username } = JSON.parse(theuser);
