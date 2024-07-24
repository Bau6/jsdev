import React, { useState, useEffect } from 'react';
import { Table, InputGroup, FormControl, Modal, Button } from 'react-bootstrap';
import tableCss from './table.module.css'; // Импортируем файл CSS
import { useNavigate } from 'react-router-dom';

function TablePage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState(null); // Столбец для сортировки
    const [sortOrder, setSortOrder] = useState(null); // Порядок сортировки
    const [selectedUser, setSelectedUser] = useState(null); // Выбранный пользователь
    const [showModal, setShowModal] = useState(false); // Состояние модального окна

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://dummyjson.com/users');
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error("Ошибка получения данных", error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = async (event) => {
        setSearchTerm(event.target.value);
        if (searchTerm.trim() === '') {
            setUsers(await fetchUsers());
        } else {
            try {
                const response = await fetch(`https://dummyjson.com/users/filter?q=${encodeURIComponent(searchTerm)}`);
                    if (!response.ok) {
                        throw new Error(`Ошибка HTTP: ${response.status}`);
                    }
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error("Ошибка поиска", error);
            }
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://dummyjson.com/users');
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            return data.users;
        } catch (error) {
            console.error("Ошибка получения данных", error);
        }
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const sortUsers = () => {
        if (sortColumn) {
            const sortedUsers = [...users].sort((a, b) => {
                if (sortColumn === 'fullName') {
                    return sortOrder === 'asc'
                        ? `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
                : `${b.lastName} ${b.firstName}`.localeCompare(`${a.lastName} ${a.firstName}`);
                } else if (sortColumn === 'age') {
                    return sortOrder === 'asc' ? a.age - b.age : b.age - a.age;
                } else if (sortColumn === 'gender') {
                    return sortOrder === 'asc' ? a.gender.localeCompare(b.gender) : b.gender.localeCompare(a.gender);
                } else if (sortColumn === 'address') {
                    return sortOrder === 'asc'
                        ? `${a.address.city}, ${a.address.address}`.localeCompare(`${b.address.city}, ${b.address.address}`)
                : `${b.address.city}, ${b.address.address}`.localeCompare(`${a.address.city}, ${a.address.address}`);
                }
                return 0;
            });
            return sortedUsers;
        }
        return users;
    };

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleClick = () => {
        navigate('/tasks'); // Вызываем navigate для перехода на '/tasks'
    };

    return (
        <div className={tableCss.indent}>
            <button onClick={handleClick}>Перейти на страницу задач</button>
            <div className="container mt-4">
                <h1>Таблица пользователей</h1>

                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Поиск..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </InputGroup>

                <Table striped bordered hover responsive="sm" className={tableCss.tableContainer}>
                    <thead>
                    <tr>
                        <th className={tableCss.tableHeader}
                            onClick={() =>
                                handleSort('fullName')}>
                            ФИО
                            {sortColumn === 'fullName' && (
                                <span
                                    className={`${tableCss.sortIcon} ${sortOrder === 'asc' ? tableCss.asc : tableCss.desc}`}/>
                            )}
                        </th>
                        <th className={tableCss.tableHeader}
                            onClick={() => handleSort('age')}>
                            Возраст
                            {sortColumn === 'age' && (
                                <span
                                    className={`${tableCss.sortIcon} ${sortOrder === 'asc' ? tableCss.asc : tableCss.desc}`}/>
                            )}
                        </th>
                        <th className={tableCss.tableHeader}
                            onClick={() => handleSort('gender')}>
                            Пол
                            {sortColumn === 'gender' && (
                                <span
                                    className={`${tableCss.sortIcon} ${sortOrder === 'asc' ? tableCss.asc : tableCss.desc}`}/>
                            )}
                        </th>
                        <th className={tableCss.tableHeader}
                            onClick={() => handleSort('address')}>
                            Адрес
                            {sortColumn === 'address' && (
                                <span
                                    className={`${tableCss.sortIcon} ${sortOrder === 'asc' ? tableCss.asc : tableCss.desc}`}/>
                            )}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortUsers().map((user) => (
                        <tr key={user.id} onClick={() => handleRowClick(user)}>
                            <td className={tableCss.tableCell}>
                                {`${user.lastName} ${user.firstName} ${user.maidenName}`}
                            </td>
                            <td className={tableCss.tableCell}>{user.age}</td>
                            <td className={tableCss.tableCell}>{user.gender}</td>
                            <td className={tableCss.tableCell}>
                                {`${user.address.city}, ${user.address.address}`}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <Modal show={showModal}
                       onHide={handleCloseModal}
                       centered
                       backdrop="static"
                       keyboard={false}
                       className={`${tableCss.modal}`}>
                    <Modal.Header>
                        <Modal.Title>Информация о пользователе</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedUser && (
                            <>
                                <p>ФИО: {`${selectedUser.lastName} ${selectedUser.firstName} ${selectedUser.maidenName}`}</p>
                                <p>Возраст: {selectedUser.age}</p>
                                <p>Адрес: {`${selectedUser.address.city}, ${selectedUser.address.address}`}</p>
                                <p>Рост: {selectedUser.height}</p>
                                <p>Вес: {selectedUser.weight}</p>
                                <p>Телефон: {selectedUser.phone}</p>
                                <p>Email: {selectedUser.email}</p>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default TablePage;
