class AudioCache {
  promise: Promise<Response>;
  constructor(url: string) {
    this.promise = new Promise((res, rej) =>
      fetch(url)
        .then((response) => {
          console.log("Reponded!");
          res(response);
        })
        .catch(rej)
    );
  }
  async get() {
    return (await this.promise).clone().arrayBuffer();
  }
}

export const soundURLs = {
  bruh: `${process.env.PUBLIC_URL}/assets/bruh.mp3`,
  click: `${process.env.PUBLIC_URL}/assets/click.mp3`,
};

export const clickSound = new AudioCache(soundURLs.bruh);
export const tickSound = new AudioCache(soundURLs.click);
