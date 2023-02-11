const socket = io("wss://vanikthai.com", {
  withCredentials: true,
  extraHeaders: {
    vanikthaiapp: "abcd",
  },
});

export default socket;
