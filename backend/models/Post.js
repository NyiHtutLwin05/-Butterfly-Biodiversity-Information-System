import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  geographicDistribution: {
    type: String,
    required: true,
    enum: [
      "Yangon",
      "Mandalay",
      "Bago",
      "Chiang Mai",
      "Bangkok",
      "Phuket",
      "Hanoi",
      "Da Nang",
      "Phnom Penh",
      "Kuala Lumpur",
      "Jakarta",
      "Manila",
      "Sentosa Island",
      "Baucau",
      "Kampong Ayer",
    ],
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  butterflySpecies: {
    type: String,
    required: true,
    enum: [
      "Tree Nymph (Idea lyuceus)",
      "Autumn Leaf (Doleschallia bisalitde)",
      "Cruiser (Vindula erota)",
      "Orchard Swallowtail (Papilio aegeus)",
      "Peacock Pansy (Junonia almana)",
      "Painted Jezebel (Delias hyparete)",
      "Malay Baron (Euthalia monina)",
      "Common Bluebottle (Graphium sarpedon)",
      "Green Dragontail (Lamproptera meges)",
      "Blue Glassy Tiger (Ideopsis vulgaris)",
      "Common Rose (Pachliopta aristolochiae)",
      "Great Orange Tip (Hebomoia glaucippe)",
      "Malayan Lacewing (Cethosia hypsea)",
      "Common Birdwing (Troides helena)",
      "Rajah Brooke's Birdwing (Trogonoptera brookiana)",
      "Other",
    ],
  },
  primaryActivity: {
    type: String,
    required: true,
    enum: ["Flying", "Feeding", "Pollinating", "Laying Eggs", "Resting"],
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  comments: {
    type: String,
    required: true,
    maxlength: 500,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
