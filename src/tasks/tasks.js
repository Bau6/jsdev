import React, { useState, useEffect } from 'react';
import {
    Button,
    Form,
    FormControl,
    InputGroup,
    Modal,
    Table,
    Container,
    Row,
    Col,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Загрузка задач из локального хранилища при монтировании компонента
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    // Сохранение задач в локальном хранилище при каждом изменении состояния
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Обработчик добавления новой задачи
    const handleAddTask = (event) => {
        event.preventDefault();
        const newTask = {
            id: Date.now(), // Простое генерирование уникального ID
            title: event.target.title.value,
            description: event.target.description.value,
            dueDate: event.target.dueDate.value,
            completed: false,
        };
        setTasks([...tasks, newTask]);
        setShowModal(false); // Закрываем модальное окно
        event.target.reset(); // Очищаем форму
    };

    // Обработчик изменения задачи
    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    // Сохранение измененной задачи
    const handleSaveEdit = (event) => {
        event.preventDefault();
        const updatedTasks = tasks.map((t) =>
            t.id === editingTask.id
                ? {
                    ...t,
                    title: event.target.title.value,
                    description: event.target.description.value,
                    dueDate: event.target.dueDate.value,
                }
                : t
        );
        setTasks(updatedTasks);
        setEditingTask(null);
        setShowModal(false);
        event.target.reset(); // Очищаем форму
    };

    // Обработчик удаления задачи
    const handleDeleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    // Обработчик изменения статуса задачи (завершение/отмена завершения)
    const handleToggleComplete = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <h1 className="text-center mb-4">Список задач</h1>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Добавить задачу
                    </Button>
                    <Table striped bordered hover className="mt-4">
                        <thead>
                        <tr>
                            <th>Заголовок</th>
                            <th>Описание</th>
                            <th>Дата завершения</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.dueDate}</td>
                                <td>
                                    <Form.Check
                                        type="switch"
                                        id={`task-switch-${task.id}`}
                                        label={task.completed ? 'Завершена' : 'Не завершена'}
                                        checked={task.completed}
                                        onChange={() => handleToggleComplete(task.id)}
                                    />
                                </td>
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEditTask(task)}
                                    >
                                        Редактировать
                                    </Button>{' '}
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteTask(task.id)}
                                    >
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Модальное окно для добавления/редактирования */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingTask ? 'Редактирование задачи' : 'Добавление задачи'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={editingTask ? handleSaveEdit : handleAddTask}>
                        <Form.Group className="mb-3">
                            <Form.Label>Заголовок:</Form.Label>
                            <FormControl
                                type="text"
                                placeholder="Введите заголовок"
                                name="title"
                                defaultValue={editingTask ? editingTask.title : ''}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Описание:</Form.Label>
                            <FormControl
                                as="textarea"
                                placeholder="Введите описание"
                                name="description"
                                defaultValue={editingTask ? editingTask.description : ''}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Дата завершения:</Form.Label>
                            <InputGroup>
                                <FormControl
                                    type="date"
                                    name="dueDate"
                                    defaultValue={editingTask ? editingTask.dueDate : ''}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editingTask ? 'Сохранить' : 'Добавить'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default Tasks;
