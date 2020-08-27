import React, { forwardRef, useState, useImperativeHandle } from 'react'
import ReactDOM from 'react-dom'
import './Modal.css'

const ModalStatus = forwardRef(
(props, ref) => {
    const [display, setDisplay] = useState(false)
    useImperativeHandle(ref, ()=>{
        return {
            openModal: ()=> open(),
            closeModal: ()=> close()
        }
    })

    const open = () => {
        setDisplay(true)
    }

    const close = () => {
        console.log('close modal')
        setDisplay(false)
    }

    if (display){
        return ReactDOM.createPortal(
            <div className="modal-wrapper">
                <div className="modal-backdrop" >
                  <div onClick={()=>close()} style={{width: '100vh',height:'100%', background:'transparent', position:'fixed'}}></div>
                    <div className="modal-box status">
                    {props.children}
                    </div>
                </div>
            </div>, document.getElementById("modal-root"))
    }

    return null
}    
)

export default ModalStatus

