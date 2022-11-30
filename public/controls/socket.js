const socket = io("ws://vanikthai.com", {
    withCredentials: true,
    extraHeaders: {
      vanikthaiapp: "abcd",
    },
  }); 

export default socket