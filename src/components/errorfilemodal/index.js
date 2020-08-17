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
          <h2>Error :(</h2>
          <p>The Users Lost connectivity kindly refresh the page or try after a while..</p>
          <button className="button okay" onClick={()=>{this.onCloseModal()}}>OK</button>
        </Modal>
      </div>
    );
  }
}
