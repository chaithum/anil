import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import config from '../config'
const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [email,setEmail]=useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/api/user/getallusers`);
                setUsers(response.data);
            } catch (error) {
                setError('Failed to fetch users. Please try again later.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Open update modal and set the selected user's data
    const handleUpdateClick = (user) => {
        setSelectedUser(user);
        setEmail(user.email);
        setUsername(user.username);
        setPhoneNumber(user.phoneNumber || '');
        setShowUpdateModal(true);
    };

    // Update the user profile
    const handleUpdateSubmit = async () => {
        const updatedData = { email: selectedUser.email, username, phoneNumber };
        try {
            await axios.put(`${config.BASE_URL}/api/user/updateProfile`, updatedData);
            const updatedUsers = users.map(user => 
                user._id === selectedUser._id ? { ...user,email, username, phoneNumber } : user
            );
            setUsers(updatedUsers);
            setShowUpdateModal(false);
        } catch (error) {
            console.error('Failed to update user:', error);
            setError('Failed to update user. Please try again.');
        }
    };

    // Delete a user
    const handleDeleteClick = async (userId) => {
        console.log(userId);
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`${config.BASE_URL}/api/user/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                console.error('Failed to delete user:', error);
                setError('Failed to delete user. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2>User List</h2>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 && !loading ? (
                        <tr>
                            <td colSpan="5" className="text-center">No users found.</td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber || 'N/A'}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleUpdateClick(user)}
                                        className="me-2"
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteClick(user._id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* Update User Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="phoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdateSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UsersList;
