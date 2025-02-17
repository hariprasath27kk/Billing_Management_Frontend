import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Modal } from 'react-bootstrap';
import { FaArrowDown, FaArrowUp, FaPlus, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdDeleteForever, MdOutlineGridView } from 'react-icons/md';
import DataTable from 'react-data-table-component';
import '../css/Home.css';

const Home = () => {
    const [rows, setRows] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('grandTotal');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products');
                setRows(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDeleteClick = (id) => {
        setSelectedProductId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/products/${selectedProductId}`);
            const updatedRows = rows.filter(row => row.id !== selectedProductId);
            setRows(updatedRows);
            toast.success(`Product with ID ${selectedProductId} deleted successfully!`);
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error(`Failed to delete product with ID ${selectedProductId}`);
        } finally {
            setShowDeleteModal(false);
            setSelectedProductId(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setSelectedProductId(null);
    };

    const sortRows = () => {
        return [...rows].sort((a, b) => {
            if (sortBy === 'grandTotal') {
                return sortOrder === 'asc' ? a.grandTotal - b.grandTotal : b.grandTotal - a.grandTotal;
            } else if (sortBy === 'createdAt') {
                return sortOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        });
    };

    const sortedRows = sortRows();

    const filteredRows = sortedRows.filter(row =>
        row.grandTotal.toString().includes(searchTerm)
    );

    // Define columns for the DataTable
    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '100px',
        },
        {
            name: 'Order Id',
            selector: row => row.ord_id,
            sortable: true,
        },
        {
            name: 'Total Amount',
            selector: row => row.grandTotal,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <span className='d-flex gap-3'>
                    <Button
                        className='btn-custom-blue btn-animate'
                        onClick={() => navigate(`/orderlist/${row.ord_id}`)}
                    >
                        <MdOutlineGridView className="fa-icon" /> View
                    </Button>
                    <Button
                        className='btn-danger btn-animate'
                        onClick={() => handleDeleteClick(row.ord_id)}
                    >
                        <MdDeleteForever className="fa-icon" /> Delete
                    </Button>
                </span>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '200px',
        },
    ];

    // Custom styles for the DataTable
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#007bff',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
            },
        },
        rows: {
            style: {
                fontSize: '14px',
                '&:hover': {
                    backgroundColor: '#f8f9fa',
                    transform: 'translateX(5px)',
                    transition: 'all 0.3s ease',
                },
            },
        },
        pagination: {
            style: {
                fontSize: '14px',
            },
        },
    };

    return (
        <div className='container'>
            <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this product? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Row className='header-custom align-items-center'>
                <Col md={2} className="d-flex">
                    <h1>OrderList</h1>
                </Col>
                <Col md={3}>
                    <Button
                        className='btn-warning btn-animate'
                        onClick={() => { setSortOrder('asc'); setSortBy('createdAt'); }}
                    >
                        <FaArrowUp className="fa-icon" /> Asc Date
                    </Button> &nbsp;
                    <Button
                        className='btn-secondary btn-animate'
                        onClick={() => { setSortOrder('desc'); setSortBy('createdAt'); }}
                    >
                        <FaArrowDown className="fa-icon" /> Des Date
                    </Button>
                </Col>
                <Col md={2}>
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder='Search by total'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </Col>
                <Col md={2} className="text-md-end mt-2 mt-md-0">
                    <Button
                        className='btn-success btn-animate'
                        onClick={() => navigate('/create')}
                    >
                        <FaPlus className="fa-icon" /> Create
                    </Button>
                </Col>
            </Row>

            {/* Replace the Table with DataTable */}
            <DataTable
                columns={columns}
                data={filteredRows}
                customStyles={customStyles}
                pagination
                highlightOnHover
                pointerOnHover
                responsive
                striped
            />
        </div>
    );
};

export default Home;