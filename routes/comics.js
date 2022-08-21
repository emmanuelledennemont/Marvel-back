const express = require("express");
const router = express.Router();
const axios = require("axios");

const isAuthenticated = require("../middleware/isAuthentificated");

router.get("/comics", isAuthenticated, async (req, res) => {
  try {
    const {  title, page = 1, limit = 100} = req.query;
    let skip = limit * page - limit;
    const response = await axios.get(
      `${process.env.API_MARVEL_URL}/comics?apiKey=${
        process.env.MARVEL_API_KEY
      }${title ? `&title=${title}` : ""}&limit=${limit}&skip=${skip}
        
      }`
    );
    const numberOfPages = Math.ceil(response.data.count / limit);

    const arrayComicsData = response.data.results;
    let arrayComics = [];
    let objAnswer = {};

    for (let i = 0; i < arrayComics.length; i++) {
      let objectComics = {};
      let titleComics = arrayComics[i].title;
      let descriptionComics = arrayComics[i].description;
      let pictureComics =
        arrayComics[i].thumbnail.path +
        "." +
        arrayComics[i].thumbnail.extension;

      if (titleComics) {
        objectComics.title = titleComics;
      }

      if (descriptionComics) {
        objectComics.description = descriptionComics;
      }

      if (pictureComics) {
        objectComics.picture = pictureComics;
      }

      arrayComicsData.push(objectComics);
    }


    objAnswer.numberOfPages = numberOfPages;
    objAnswer.comics = arrayComics;

    res.status(200).json(objAnswer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/comics/:characterId", isAuthenticated, async (req, res) => {
  try {
    const { characterId } = req.params;
    const response = await axios.get(
      `${process.env.API_MARVEL_URL}/comics/${characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );

    const arrayComicsWithCharacterData = response.data.comics;
    let arrayComicsWithCharacter = [];
    let objAnswer = {};

    for (let i = 0; i < arrayComicsWithCharacterData.length; i++) {
      let objectComicsWithCharacter = {};
      let comicsWithCharacterTitle = response.data.comics[i].title;
      let comicsWithCharacterDescription = response.data.comics[i].description;
      let comicsWithCharacterPicture =
        response.data.comics[i].thumbnail.path +
        "." +
        response.data.comics[i].thumbnail.extension;
      let comicsWithCharacterId = response.data.comics[i]._id;

      if (comicsWithCharacterTitle) {
        objectComicsWithCharacter.title = comicsWithCharacterTitle;
      }

      if (comicsWithCharacterDescription) {
        objectComicsWithCharacter.descritpion = comicsWithCharacterDescription;
      }

      if (comicsWithCharacterPicture) {
        objectComicsWithCharacter.picture = comicsWithCharacterPicture;
      }

      if (comicsWithCharacterId) {
        objectComicsWithCharacter._id = comicsWithCharacterId;
      }

      arrayComicsWithCharacter.push(objectComicsWithCharacter);
    }

    comicsPrincipalPicture =
      response.data.thumbnail.path + "." + response.data.thumbnail.extension;
    let objectComicsPrincipalPicture = {
      character_picture: comicsPrincipalPicture,
    };

    objAnswer.principalCharacterPicture = comicsPrincipalPicture;
    objAnswer.arrayOfComics = arrayComicsWithCharacter;

    res.status(200).json(objAnswer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
