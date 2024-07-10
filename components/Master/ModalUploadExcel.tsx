import React, { Component } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

interface ModalUploadExcelProps {
    isOpen: boolean;
    onClose: () => void;
    loadTableData: () => void;
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

    handleUpload = async () => {
        if (this.state.file) {
            // Handle file upload logic here
            console.log('Uploading file:', this.state.file);
            const formData = new FormData();
            const API_URL = 'api/user-excel-upload';
            formData.append('file', this.state.file);

            try {
                const response = await axios.post(API_URL, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: "Bearer " + Cookies.get("accessToken"),
                    },
                });

                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'File uploaded successfully!',
                    });

                    this.props.onClose();
                    // Assuming you have a method to load the data of the table
                    this.props.loadTableData();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to upload file.',
                    });
                }
            } catch (error: any) {
                alert('Error uploading file: ' + error.message);
            }
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
