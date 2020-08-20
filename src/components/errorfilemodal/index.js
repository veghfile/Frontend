import React from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import './style.css';
export default class FileModal extends React.Component {
  state = {
    open: this.props.openModal,
    mssg: this.props.children,
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
          <h2>:(</h2>
          <p>{this.state.mssg}</p>
          <button className="button okay" onClick={()=>{this.onCloseModal()}}>OK</button>
        </Modal>
      </div>
    );
  }
}
