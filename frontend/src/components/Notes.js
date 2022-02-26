import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Notes = ({ handleClose, show, jobToEdit }) => {
    console.log(jobToEdit)
    return (
        <Modal show={show} fullscreen={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Notes</Modal.Title>
            </Modal.Header>
            <Modal.Body>{jobToEdit.notes}</Modal.Body>
            <Modal.Footer>
                <Button variant="success" style={{ marginRight: "auto" }}>
                    Edit
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Modal.Footer>

        </Modal>
    )
}

export default Notes;