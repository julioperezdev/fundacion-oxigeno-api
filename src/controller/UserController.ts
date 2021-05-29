import {Request, Response} from "express"
import path from "path"
import fs from "fs-extra"
import cloudinary from "../config/cloudinary"

import {ProfileUploadImage} from "../dto/request/ProfileUploadImage"

//import {uploadImage} from "../helper/UploadImageCloudinary"

import {updateNameAndSurnameUserById, uploadImageInformationProfileById , getPhotoIdByIdUser, getAllUsers} from "../database/UserDatabase"


export const updateNameAndSurnameById = async(request: Request, response: Response) => {
  
  var user = {
    name : request.body.name,
    surname : request.body.surname,
    idUser : request.body.idUser
  };
  console.log(request.body);
  console.log(user);
  if(!user.idUser || !user.surname || !user.name){
    return response.json({
      "status":400,
      "message":"TO EXECUTE THIS FUNCTION YOU NEED SEND A ID"
  })}

  const userUpdated = await updateNameAndSurnameUserById(user);
  return response.json({
        "status":200,
        "data":userUpdated,
        "message":"USER WAS UPDATED"
    })
 
}

export const uploadPhotosById = async(request: Request, response:Response): Promise<Response> => {
    const id = request.params.id
    
    console.log(request.file)

    const result = await cloudinary.uploader.upload(request.file.path);
  

    await deletePhotoByIdWhenIWillUpdate(parseInt(id));
   
    console.log(result)
    
    const profile : ProfileUploadImage= {
        id : parseInt(id),
        urlimage: result.url,
        publicid: result.public_id
    }
    await deletePhotoByIdWhenIWillUpdate(profile.id);
    const updatedProfile = await uploadImageInformationProfileById(profile);
    
    await fs.unlink(request.file.path)

    return response.json({
        usernameUpdated: updatedProfile,
        status: 200 
    })
}

const deletePhotoByIdWhenIWillUpdate = async(id: number) =>{

  const photoIdFromDatabase = await getPhotoIdByIdUser(id);
  await cloudinary.uploader.destroy(photoIdFromDatabase.rows[0].publicid);
  
  

}

export const getAllUsersController = async(request: Request, response: Response) =>{
    const allUsers = await getAllUsers();
  
    return response.json({ data: allUsers})
  }


