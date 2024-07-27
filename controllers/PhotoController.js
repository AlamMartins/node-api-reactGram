const Photo = require("../models/Photo");

const User = require("../models/User")

const mongoose = require("mongoose");

//Inser a photo, with an user related to it
const insertPhoto = async (req, res) => {
    const {title} = req.body;
    const image = req.file.filename;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    //Create a photo

    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    })

    //If photo was created sucessfully, return data
    if(!newPhoto){
        res.status(422).json({
            errors: ["Houve um problema, por favor tente novamente"]
        })
        return true
    }


    res.status(201).json(newPhoto)
}

// Remove a photo from DB
const deletePhoto = async(req, res) => {

    const {id} = req.params
    const reqUser = req.user;

    try {
        const photo  = await Photo.findById(id)

        // Check if photo exists - verificando se a foto existe
        if(!photo){
            res.status(404).json({errors: ["Foto não encontrada!"]});
            return;
        }
    
        //Check if photo belongs to user - o mesmo usuário que estiver deletando a foto ser o dono dela
        if(!photo.userId.equals(reqUser._id)){
            res
                .status(422)
                .json({errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]})
            return;
        }
    
        //Passou das validações podemos realizar o delete
        await Photo.findByIdAndDelete(photo._id);
    
        res 
            .status(200)
              .json({id: photo._id, message: "Foto excluída com sucesso."});
        } catch (error) {
            res.status(404).json({errors: ["Foto não encontrada!"]});   
    }
 
}

// Get all photos - Capturando todas as fotos
const getAllPhotos = async(req, res) => {

    const photos = await Photo.find({})
        .sort([["createdAt",-1]])
        .exec() //sort ordenando as fotos mais novas no topo, exec pra executar.

    return res.status(200).json(photos)
}

// get user photos
const getUserPhotos = async(req, res) => {

    const {id} = req.params;

    const photos = await Photo.find({userId: id})
    .sort([["createdAt",-1]])
    .exec() //sort ordenando as fotos mais novas no topo, exec pra executar.

    return res.status(200).json(photos)


}


// Get photo by id
const getPhotoById = async (req, res) => {
    const { id } = req.params;
    let photo;
    
    try{
          photo = await Photo.findById(new mongoose.Types.ObjectId(id));

            // Check if photo exists
        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada!"] });
        return;
      }

    }catch(error){
        res.status(404).json({errors: ["Foto não encontrada, falha na captura do ID - Error: "+error]});  
    }
    
    res.status(200).json(photo);
  };


  //Update a photo

  const updatePhoto = async(req, res) => {

    const {id} = req.params;
    const {title} = req.body;
    const reqUser = req.user

    const photo = await Photo.findById(id);

    // check if photo exists
    if(!photo){
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return
    }

    // check if photo exists
    if(!photo.userId.equals(reqUser._id)){
        res.status(422).json({ errors: ["Ocorreu um error, tente novamente mais tarde.!"] });
        return
    }

    if(title){
        photo.title = title;
    }

    await photo.save()

    res.status(200).json({photo, message: "Foto atualizada com sucesso"})

  }

  //like na foto funcionalidade
  const likePhoto = async(req, res) => {

    const {id} = req.params;
    const reqUser = req.user;
    const photo = await Photo.findById(id)

    // check if photo exists
    if(!photo){
        res.status(404).json({ errors: ["Foto não encontrada!"] });
        return
    }

    // check if user already liked the photo (Verificando já existe like na foto)
    if(photo.likes.includes(reqUser._id)){
        res.status(422).json({errors: ["Você já curtiu a foto."]})
        return
    }

    //put user id in likes array (Array de likes que será armazenado caso seja validado)
    photo.likes.push(reqUser._id)

    //save photo.likes in database
    await photo.save()

    res.status(200).json({photoId: id, userId: reqUser._id, message: "A foto foi curtida."})
    

  }

  // Comentário - Comment Functionality
  const commentPhoto = async(req,res) => {
        
        const {id} = req.params;
        const {comment} = req.body;
        const reqUser = req.user;

        //Capturando ID do usuário
        const user = await User.findById(reqUser._id)

        //Capturando ID da foto
        const photo = await Photo.findById(id)

        // check if photo exists
        if(!photo){
            res.status(404).json({ errors: ["Foto não encontrada!"] });
            return
        }

    //Put comment in the array comments
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id
    };

    photo.comments.push(userComment)

    await photo.save()

    res.status(200).json({
        comment: userComment,
        message: "O comentário foi adicionado com sucesso!"
    })


  }

  //Search photos by title (Buscar fotos pelo titulo)
  const searchPhotos = async(req, res) => {

    const {q} = req.query; //esperando queryString da URL
    const photos = await Photo.find({title: new RegExp(q, "i")}).exec() //Regex para identificar e exec para executar a query
    res.status(200).json(photos);

  }



module.exports = {
    getPhotoById,
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos
} 