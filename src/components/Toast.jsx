import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Toast as BsToast } from "bootstrap/dist/js/bootstrap.bundle.min";
import { removeMessage } from "../slices/toastSlice";

export default function Toast() {

    const messages = useSelector((state)=>state.toast.messages)
    const toastRefs = useRef({});
    const disPatch = useDispatch();

    useEffect(()=>{
        messages.forEach(message => {
            const messageElement = toastRefs.current[message.id];

            if(messageElement) {
              const toastInstance =  new BsToast (messageElement);

              toastInstance.show();

              setTimeout(()=>{
                disPatch(removeMessage(message.id))
              },2000)
            }
        });
    },[messages])

    const handleDismiss = (id)=>{
        disPatch(removeMessage(id))
    }

    return (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1000 }}>
            {messages.map((message)=>(
                <div key={message.id} ref={(el)=>toastRefs.current[message.id] = el} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div className={`toast-header ${message.status === 'success' ? 'bg-success' : 'bg-danger'} text-white`}>
                    <strong className="me-auto">{message.status === 'success' ? '成功' : '失敗'}</strong>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={()=>handleDismiss(message.id)}
                    ></button>
                </div>
                <div className="toast-body">{message.text}</div>
            </div>
            ))}
            
        </div>

    )
}