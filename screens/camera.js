import * as React from "react"
import {Button,Image,View,Platform, Alert,TouchableOpacity,Text} from "react-native"
import * as imagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component{
    constructor(){
        super()
        this.state = {
            image:null
        }
    }
    
    render(){
        return(
            <View style = {{flex:1,justifyContent:"center",alignItems:"center"}}>
                <TouchableOpacity onPress = {this.selectPicture}><Text>Pick an image from camera roll</Text></TouchableOpacity>
            </View>
        )
    }

    componentDidMount(){
        this.getPermissionsAsync()
    }

    getPermissionsAsync = async () => {
        if(Platform.OS != "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status != "granted") {
                Alert.alert("Sorry we need camera roll permissions")
            }
        }
    }

    uploadImage = async (uri) => {
        var data = new FormData()
        var fileName = uri.split("/")[uri.split("/").lenght - 1 ]
        var type = `image/${uri.split(".")[uri.split(".").lenght - 1]}`
        const fileToUpload = {
            uri:uri,
            name:fileName,
            type:type
        }
        data.append("digit",fileToUpload)
        fetch("https://e96a13877431.ngrok.io ", {
            method: "POST",
            body: data,
            headers: {
              "content-type": "multipart/form-data",
            },
          })
            .then((response) => response.json())
            .then((result) => {
              console.log("Success:", result);
            })
            .catch((error) => {
              console.error("Error:", error);
            });    }

    selectPicture = async () => {
        try{
            let result = await imagePicker.launchImageLibraryAsync({
              mediaTypes: imagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 3],
                  quality: 1,
                });
            
            console.log(result);
            
            if (!result.cancelled) { this.setState({
                image:result.data
            })
                this.uploadImage(result.uri)
            }
        }
        catch(error){
            console.log(error)
        }
    }

}
