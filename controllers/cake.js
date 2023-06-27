import { Cake } from "../models/cake.js";
import ErrorHandler from "../middlewares/error.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addCake= async (req, res, next) => {
    try {
      const newCake = await Cake.create(req.body);
      res.status(201).json("cake added succesfully");
    }
     catch (error) {
            next(error);
          }
    };


export const deleteCake=async (req, res, next) => {
    try {
      const _id = req.body.id;
      console.log(_id);
      await Cake.findByIdAndDelete(_id);
      res.sendStatus(204);
    }  catch (error) {
        next(error);
      }
  };


export const getAllCakes=async (req, res, next) => {
    try {
      const cakes = await Cake.find();
      res.json(cakes);
    }  catch (error) {
        next(error);
      }
  };


export const getCakebyId=async (req, res, next) => {
    try {
      const { id } = req.params;
      const cake = await Cake.findById(id);
      if (cake) {
        res.json(cake);
      } else {
        res.status(404).json({ message: 'Cake not found' });
      }
    }  catch (error) {
        next(error);
      }
  };

  // Specify the destination folder for storing the uploaded files
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      //const destination = path.join(__dirname, '../../cakeshop/public/images');
       const destination = path.join('E:/projects/Cakeshop webste', 'cakeshop', 'public', 'images');
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now()+file.originalname);
    },
  });

  //for single image
  const upload = multer({ storage: storage }).single('image');

  export const uploadController=async(req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.error('Error uploading fil:', err);
        res.status(500).json({ error: 'Failed to upload file' });
      } else {
        const file = req.file;
  
        // Send the filename back as a response
        res.status(200).json({ filename: file.filename });
      }
    });
  };

  //for multiple images
  
  //  const uploads = multer({ storage: storage }).array('images', 3);

  //  export const uploadsController = async (req, res) => {
  //   uploads(req, res, (err) => {
  //     if (err) {
  //       console.error('Error uploading files:', err);
  //       res.status(500).json({ error: 'Failed to upload files' });
  //     } else {
  //       const files = req.files;
  //       console.log('Uploaded files:', files);
  
  //       // Extract the filenames from the uploaded files
  //       const filenames = files.map((file) => file.filename);
  
  //       // Send the filenames back as a response
  //       res.status(200).json({ filenames });
  //     }
  //   });
  // };