import React, { useState } from 'react';
import axios from 'axios';
import { Button, Col, Dropdown, Row, Table } from 'react-bootstrap';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Create = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([{
        id: 1,
        productName: '',
        quantity: '',
        price: '',
        total: 0,
        isChecked: false
    }]);

    const [coupon, setCoupon] = useState('');
    const [discountValue, setDiscountValue] = useState(0);

    const handleAdd = () => {
        const newRow = { id: rows.length + 1, productName: '', quantity: '', price: '', total: 0, isChecked: false };
        setRows([newRow, ...rows]);
    };

    const handleDelete = () => {
        const selectedRows = rows.filter(row => row.isChecked);
        if (selectedRows.length === 0) return;

        const updatedRows = rows.filter(row => !row.isChecked);
        setRows(updatedRows);
        toast.success('product removed!'); 
    };

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;

        if (field === 'quantity' || field === 'price') {
            const quantity = parseFloat(updatedRows[index].quantity) || 0;
            const price = parseFloat(updatedRows[index].price) || 0;
            updatedRows[index].total = quantity * price;
        }

        setRows(updatedRows);
    };

    const handleCheckboxChange = (index) => {
        const updatedRows = [...rows];
        updatedRows[index].isChecked = !updatedRows[index].isChecked;
        setRows(updatedRows);
    };

    const handleCouponChange = (value) => {
        setCoupon(value);

        switch (value) {
            case '10%':
                setDiscountValue(0.1);
                break;
            case '20%':
                setDiscountValue(0.2);
                break;
            case '30%':
                setDiscountValue(0.3);
                break;
            case '50%':
                setDiscountValue(0.5);
                break;
            default:
                setDiscountValue(0);
        }
    };

    const generateRandomId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    const handleSubmit = async () => {
        const orderId = generateRandomId();
        const grandTotal = calculateTotalAmount();
        const totalAfterCoupon = calculateTotalAfterCoupon();

        
    const allFieldsFilled = rows.every(row => row.productName && row.quantity && row.price);

    console.log("allfiled",allFieldsFilled)

    if (!allFieldsFilled) {
        toast.error('Please fill in all fields for all products before submitting.');
        return; 
    }

    if (rows.length === 0) {
        toast.error('Add row Product');
        return; 
    }

        const promises = rows.map(async (row) => {
            if (row.productName && row.quantity && row.price) {
                try {
                    const response = await axios.post(`http://localhost:8080/api/products`, {
                        id: orderId, 
                        productName: row.productName,
                        quantity: row.quantity,
                        price: row.price,
                        total: row.total,
                        coupon: coupon, 
                        grandTotal: grandTotal, 
                        totalAfterCoupon: totalAfterCoupon 
                    });
                    console.log("Submitting row:", response.data);
                    return true; 
                } catch (error) {
                    console.error('Error creating product:', error);
                    toast.error(`Failed to create product ${row.productName}`);
                    return false;
                }
            } else {
                toast.error(`Please fill in all fields for product ${row.productName}`);
                return false; 
            }
        });

        const results = await Promise.all(promises);

        if (results.every(result => result === true)) {
           toast.success('All products created successfully!');
           navigate('/');

        }
    };

    const calculateTotalAmount = () => {
        return rows.reduce((total, row) => total + (row.total || 0), 0);
    };

    const calculateTotalAfterCoupon = () => {
        const totalAmount = calculateTotalAmount();
        return totalAmount - (totalAmount * discountValue);
    };

    return (
        <>
            <Link to='/' className='btn btn-secondary'> <FaArrowLeft />Back to Home</Link>
            <div className='border border-3 mt-2 p-4 container'>
                <Row>
                    <Col md={10} className="d-flex">
                        <span className='fs-2 d-flex align-items-center'>
                            <input type="checkbox" className='' onChange={(e) => {
                                const checked = e.target.checked;
                                setRows(rows.map(row => ({ ...row, isChecked: checked })));
                            }} />
                            <label className="ms-2">All</label>
                        </span>
                    </Col>
                    <Col md={2} className="text-md-end mt-2 mt-md-0">
                        <div className='d-flex gap-3'>
                            <Button
                                style={{ backgroundColor: "green", border: "2px solid green" }}
                                onClick={handleAdd}
                                className='d-flex align-items-center'>
                                <FaPlus /> Add
                            </Button>
                            <Button
                                style={{ backgroundColor: "red", border: "2px solid red" }}
                                onClick={handleDelete}
                                className='d-flex align-items-center'>
                                Delete
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>S.NO</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={row.id}>
                                <td>
                                    <input type="checkbox" checked={row.isChecked} onChange={() => handleCheckboxChange(index)} />
                                </td>
                                <td>{index + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder='Enter a Product Name'
                                        value={row.productName}
                                        onChange={(e) => handleInputChange(index, 'productName', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        placeholder='0'
                                        value={row.quantity}
                                        onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        placeholder='0.00'
                                        value={row.price}
                                        onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                    />
                                </td>
                                <td>{row.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Row className="justify-content-end">
                    <Col className='d-flex flex-column border col-3'>
                        <div className='text-end'>
                            <h4>Grand Total: ${calculateTotalAmount().toFixed(2)}</h4>
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    {coupon || 'Select a Coupon'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleCouponChange('10%')}>10%</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleCouponChange('20%')}>20%</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleCouponChange('30%')}>30%</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleCouponChange('50%')}>50%</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleCouponChange('')}>Clear Coupon</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <h4>Total after coupon: ${calculateTotalAfterCoupon().toFixed(2)}</h4>
                            <Button onClick={handleSubmit}>Submit</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Create;




