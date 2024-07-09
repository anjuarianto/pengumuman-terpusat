import React, { Component } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface ModalUploadExcelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ModalUploadExcelState {
    file: File | null;
}

class ModalUploadExcel extends Component<ModalUploadExcelProps, ModalUploadExcelState> {
    constructor(props: ModalUploadExcelProps) {
        super(props);
        this.state = {
            file: null,
        };
    }

    handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        this.setState({ file });
    };

    handleUpload = () => {
        if (this.state.file) {
            // Handle file upload logic here
            console.log('Uploading file:', this.state.file);
            const formData = new FormData();
            const url = process.env.API_URL + '/upload-user-excel';
            formData.append('file', this.state.file);

            fetch(url, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    // You can add more logic here to handle the response
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    render() {
        const { isOpen, onClose } = this.props;
        const { file } = this.state;

        return (
            <Modal open={isOpen} onClose={onClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        Upload Excel File
                    </Typography>
                    <input type="file" accept=".xlsx, .xls" onChange={this.handleFileChange} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleUpload}
                        disabled={!file}
                        sx={{ mt: 2 }}
                    >
                        Upload
                    </Button>
                </Box>
            </Modal>
        );
    }
}

export default ModalUploadExcel;
