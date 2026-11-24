const DATA = {
  room1: [
    { type: "wall",
      image: "images/room1/artifact1.png",
      frame: "images/frames/frame-gold.png",   // YOUR frame PNG (optional)
      frameInset: "-10%",                      // how far the frame extends past the art (optional)
      plaque: "below",                         // "below", "right", or "left" (optional, default "below")
      short: "Artifact Name", title: "Artifact Name", meta: "Year · Creator",
      body: "Your researched text." },

    { type: "floor",
      image: "images/room1/artifact2.png",
      pedestal: "images/pedestals/pedestal-round.png",  // YOUR pedestal PNG (optional)
      pedestalWidth: "18vh",                            // how wide the pedestal is (optional)
      plaque: "right",
      short: "Second Artifact", title: "Second Artifact", meta: "Year · Creator",
      body: "More text." },

    { type: "wall",
      image: "images/room1/artifact3.png",
      // no frame line = falls back to the simple CSS border
      plaque: "left",
      short: "Third", title: "Third", meta: "Year", body: "Text." }
  ]
};