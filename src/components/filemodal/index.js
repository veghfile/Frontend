import React from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import './style.css';
export default class FileModal extends React.Component {
  state = {
    open: this.props.openModal,
  };

  onCloseModal = () => {
    this.setState({ open: false });
    this.props.handleAbort()
  };
  render() {
    const { open } = this.state;
    return (
      <div>
        <Modal open={open} onClose={this.onCloseModal} closeOnOverlayClick={false} center>
          <h2>File Transfer Request</h2>
          <p>You have an incoming file transfer request. What would you like to do?</p>
          <button className="button close" onClick={()=>{this.onCloseModal()}}>Reject</button>
          <button className="button okay" onClick={()=>{this.props.handleDownload();this.onCloseModal()}}>Accept</button>
        </Modal>
      </div>
    );
  }
}
