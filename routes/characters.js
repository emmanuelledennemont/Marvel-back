const express = require("express");
const router = express.Router();
const axios = require("axios");
//const isAuthenticated = require("../middleware/isAuthenticated");


router.get("/characters", async (req, res) => {
  try {

    const { page = 1, limit = 100, name } = req.query;

    let skip = limit * page - limit;

    const response = await axios.get(
      `${process.env.API_MARVEL_URL}/characters?apiKey=${
        process.env.MARVEL_API_KEY
      }&limit=${limit}&skip=${skip}&name=${name ? name : ""}`
    );

    const numberOfPages = Math.ceil(response.data.count / limit);

    const arrayCharacters = response.data.results;

    const arrayPersoDetails = [];
    const objAnswer = {};

    for (let i = 0; i < arrayCharacters.length; i++) {

      let objectCharac = {};

      let idCharac = arrayCharacters[i]._id;
      let nameCharacter = arrayCharacters[i].name;
      let descriptionCharacter = arrayCharacters[i].description;
      let pictureCharacterUrl =
        arrayCharacters[i].thumbnail.path +
        "." +
        arrayCharacters[i].thumbnail.extension;

      if (nameCharacter) {
        objectCharac.name = nameCharacter;
      }

      if (descriptionCharacter) {
        objectCharac.description = descriptionCharacter;
      }

      if (pictureCharacterUrl) {
        objectCharac.picture = pictureCharacterUrl;
      }

      if (idCharac) {
        objectCharac._id = idCharac;
      }


      arrayPersoDetails.push(objectCharac);
      objAnswer.numberOfPages = numberOfPages;
      objAnswer.characters = arrayPersoDetails;
    }

    res.status(200).json(objAnswer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get("/character/:characterId",  async (req, res) => {
  try {

    const { characterId } = req.params;
    const response = await axios.get(
      `${process.env.API_MARVEL_URL}/character/${characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );

    const objAnswer = {};

    if (response.data.thumbnail.path && response.data.thumbnail.extension) {
      objAnswer.pictureCharacter =
        response.data.thumbnail.path + "." + response.data.thumbnail.extension;
    }

    if (response.data.comics) {
      objAnswer.comics_id = response.data.comics;
    }

    if (response.data._id) {
      objAnswer.character_id = response.data._id;
    }

    if (response.data.name) {
      objAnswer.character_name = response.data.name;
    }

    if (response.data.description) {
      objAnswer.character_descritpion = response.data.description;
    }

    res.status(200).json(objAnswer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;