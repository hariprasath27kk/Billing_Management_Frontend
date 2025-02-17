import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

const OrderList = () => {
    const { id } = useParams();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products/${id}`);
                setRows(response.data);
                console.log("data", response.data)
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch order list.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        )
    }

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    return (
        <>
            <div className='border border-3 mt-5 p-3 container'>

                <Link className='btn btn-success' to='/'><FaLongArrowAltLeft />Go Back</Link>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>ord_id</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Coupen</th>
                            <th>GrandTotal</th>
                            <th>Total Amout include coupen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((order, index) => (
                            <tr key={order.id}>
                                <td>{index + 1}</td>
                                <td>{order.ord_id}</td>
                                <td>{order.productName}</td>
                                <td>{order.quantity}</td>
                                <td>{order.total}</td>
                                <td>{order.coupon}</td>
                                <td>{order.grandTotal}</td>
                                <td>{order.totalAfterCoupon}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default OrderList;
