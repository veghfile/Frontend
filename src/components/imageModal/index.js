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
  };
  render() {
    const { open } = this.state;
    return (
      <div>
        <Modal open={open} onClose={this.onCloseModal} closeOnOverlayClick={false} center>
          <h2>Preview captured from clipboard</h2>
          <img id="preview" src={this.props.src} />
          <button className="button okay" onClick={()=>{this.onCloseModal()}}>OK</button>
        </Modal>
      </div>
    );
  }
}
