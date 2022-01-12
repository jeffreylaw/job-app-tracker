import React from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const DeleteJobConfirm = ({ show, hide }) => {

    return (
        <Modal show={show} onHide={hide} >
            <Modal.Dialog>
                <Modal.Body closeButton>
                    <p>Are you sure you want to delete this job?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => hide()}>No</Button>
                    <Button variant="primary" onClick={() => hide()}>Yes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}

export default DeleteJobConfirm;