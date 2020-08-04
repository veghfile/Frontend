import React from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import './style.css';
export default class FileModal extends React.Component {
  state = {
    open: false,
  };
  onOpenModal = () => {
    this.setState({ open: true });
  };
  onCloseModal = () => {
    this.setState({ open: false });
  };
  render() {
    const { open } = this.state;
    return (
      <div>
        <button onClick={this.onOpenModal}>Open modal</button>
        <Modal open={open} onClose={this.onCloseModal} center>
          <h2>File Transfer Request</h2>
          <p>You have an incoming file transfer request. What would you like to do?</p>
          <button className="button close" onClick={this.onCloseModal}>Reject</button>
          <button className="button okay">Accept</button>
        </Modal>
      </div>
    );
  }
}