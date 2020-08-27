import React ,{ PureComponent } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import './CreatePost.css'

class CreatePost extends PureComponent {
  state = {
    src: null,
    crop: {
      unit: '%',
      width: 30,
      aspect: 1 / 1,
    },

    croppedImageUrl: null,
    caption: '',
    url    : '',

    loading: false,
    
    photo: ''
  }

  onSelectFile = e => {
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
        this.setState({src: fileReader.result })
    }   
    fileReader.readAsDataURL(e.target.files[0])
  }

  onImageLoaded = image => {
      this.imageRef = image
  }

  onCropChange = (crop) => {
      this.setState({ crop })
  }

  onCropComplete = async crop => {
      if (this.imageRef && crop.width && crop.height) {
          const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop)
          this.setState({ croppedImageUrl })
      }
  }



  getCroppedImg(image, crop) {
      const canvas = document.createElement("canvas")
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext("2d")
      
      ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
      )

      const reader = new FileReader()
      canvas.toBlob(blob => {
          reader.readAsDataURL(blob)
          reader.onloadend = () => {
              this.dataURLtoFile(reader.result, 'cropped.jpg')
          }
      })
  }

  dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?)/)[1],
          bstr = atob(arr[1]), 
          n = bstr.length, 
          u8arr = new Uint8Array(n)
              
      while(n--){
          u8arr[n] = bstr.charCodeAt(n)
      }
      let croppedImage = new File([u8arr], filename, {type:mime})
      this.setState({croppedImage: croppedImage }) 
  }  


  

  postDetails = () => {
       this.setState({loading: true})
       const data = new FormData()
       data.append("file",this.state.croppedImage)
       data.append("upload_preset","inscatgram")
       data.append("cloud_name","smilj4npj4nic")
       fetch("https://api.cloudinary.com/v1_1/smilj4npj4nic/image/upload",{
           method:"post",
           body:data
       })
       .then(res=>res.json())
       .then(data=>{
          this.setState({url: data.url})
       })
       .catch(err=>{
           this.setState({loading:false})
          //  this.setState({errors: err})
       })    
  }


  componentDidMount (){
    this.setState({photo: JSON.parse(localStorage.getItem('user')).photo})
  }

  componentDidUpdate (prevProps, prevState ) {
    if( prevState.url !== this.state.url){
      fetch('http://localhost:5000/api/post/create',{
        method: 'POST',
        headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            body: this.state.caption,
            image:this.state.url,
            createdAt: new Date()
        })
      }).then(res => res.json())
      .then(data => {
        if(data.error){
          this.setState({loading: false})
          // this.setState({errors: data.error})

        } else {
          // this.setState({errors:''})
          this.setState({loading: false})
          this.props.history.push('/')
        }
      })
    }
  }


  render() {
    const { crop, croppedImage, src , photo} = this.state

    return (
      <div className="page">
      {croppedImage &&
                <div className='new-status-button' onClick={()=>this.postDetails()}>
                  {this.state.loading? <i className="fa fa-spinner fa-spin"></i>:`Share` } 
                </div>      
      }
      
          <div className="create-post-container" style={{  marginTop:'5rem'}}>
            

            <input type="file" accept="image/*" onChange={this.onSelectFile} name="image-upload" id="input"/>

            {
              window.innerWidth <=768 &&
              <div className="label">
                <label className="image-upload" htmlFor="input">
                            <i className="fa fa-camera"></i>
                </label>
              </div>

            }

            {!src && (
              <>
                <div className='reminder'><b>
                {(window.innerWidth > 768)?
                'Please change your device screen into mobile mode to open up this tool and refresh it'
                :
                'Select a new photo to add status'
                }
                </b></div>
              </>
            )}

            {src && (
              <ReactCrop
                src={src}
                crop={crop}
                ruleOfThirds
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
                style={{
                  width: '100vh',
                }}
              />
            )}

            {croppedImage && (
              <>
 

                <div className="new-post-wrapper"> 
                    <div className="new-post-component">
                    <img className='profile-pic' src={photo} alt="profile"/>
                    </div>

                    <div className="new-post-component textarea">
                        <textarea id="caption"
                                  name="caption" 
                                  rows="4" 
                                  cols="50"
                                  placeholder='Write a caption ...'
                                  onChange= {(e)=> this.setState({caption: e.target.value})}
                                  >
                        </textarea>
                    </div>

                    <div className="new-post-component" style={{ width:'8rem' }} >
                    <img className='cropped-pic' src={URL.createObjectURL(croppedImage)} alt="croppedpic"/>
                    </div>

                </div>

                {/* {this.state.errors && <div className="post-errors">{this.state.errors}</div> }                 */}

                {/* <div className='new-status-button' onClick={()=>this.postDetails()}>
                  {this.state.loading? <i className="fa fa-spinner fa-spin"></i>:`Share` } 
                </div>  */}
              </>
              
            )}


          </div>
      </div>
    )
  }
}




export default CreatePost























// import React, { Component } from 'react'
// import plus from '../assets/plus.png'

// import './CreatePost.css'

// export class CreatePost extends Component {
//   state={
//     profileImg:{plus}
//   }
//   imageHandler = (e) => {
//     const reader = new FileReader()
//     reader.onload = () =>{
//       if(reader.readyState === 2){
//         this.setState({profileImg: reader.result})
//       }
//     }
//     reader.readAsDataURL(e.target.files[0])
//   }
// 	render() {
//     const { profileImg} = this.state
// 		return (
// 			<div className="page">
// 				<form className="create-post-container">
// 					<div className="img-holder">
// 						<img src={profileImg} alt="" id="img" className="img" />
// 					</div>
// 					<input type="file" accept="image/*" name="image-upload" id="input" onChange={this.imageHandler} />
// 					<div className="label">
//                        <label className="image-upload" htmlFor="input">
//                           <i className="fa fa-camera"></i>
// 					   </label>
//                     </div>

//                     <div style={{
//                         padding:'.1rem 2rem'
//                     }}>
                    
//                     <textarea id="caption"
//                               name="caption" 
//                               rows="4" 
//                               cols="50"
//                               placeholder='Write a caption ...'

//                               style={{
//                                 width: '100%',
//                                 marginTop:'-3rem',
//                                 border:'1px solid #ececec', 
//                                 padding: '2rem',
//                                 borderRadius: '1rem',
//                                 fontFamily:'"Open Sans", Arial, sans-serif'
//                               }}
//                               >
//                     </textarea>

//                     <input type="submit" 
//                           //  placeholder='Add new post'
//                         style={{
//                             display: 'block',
//                             width: '100%',
//                             borderRadius: '1.3rem',
//                             height: '4rem',
//                             marginTop: '0.4rem',
//                             background: '#3897f0',
//                             // background:'#262626',
//                             color: 'white',
//                             fontSize: '1.7rem',
//                             border:'none'



//                         }}
//                     />

//                     </div>



// 				</form>
// 			</div>
// 		)
// 	}
// }

// export default CreatePost
