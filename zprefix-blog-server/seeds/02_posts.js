exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("posts")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("posts").insert([
        {
          author_id: 3,
          title: "Where are we?",
          content:
            "I don't know what this place is, and nor it seems does anyone else. Nothing to do but move forward and note whatever I find.",
        },
        {
          author_id: 2,
          title: "What's the point?",
          content:
            "Okay, so I get that I'm supposed to retrieve these sigils. I just don't get WHY. Sure the loud voice is telling me to, but this world of his has no context, no purpose, and no foundations from which to construct them.",
        },
        {
          author_id: 3,
          title: "Archive or design?",
          content:
            "I can't tell if the documents on the terminals are all that's left from a larger archive, or are carefully designed to communicate some hidden truth.",
        },
        {
          author_id: 1,
          title: "Seeking secrets",
          content:
            "Few come this far, but I believe we must seek out the secrets of this world if we want to truly serve the generations to come.",
        },
      ]);
    });
};
