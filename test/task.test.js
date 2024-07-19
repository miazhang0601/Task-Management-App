const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Make sure to export your Express app from index.js
const { expect } = chai;

chai.use(chaiHttp);

describe('Task API', () => {
    describe('GET /tasks', () => {
        it('should get all tasks', (done) => {
            chai.request(app)
                .get('/tasks')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('POST /tasks', () => {
        it('should create a new task', (done) => {
            chai.request(app)
                .post('/tasks')
                .send({ title: 'Test Task' })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('id');
                    expect(res.body).to.have.property('title', 'Test Task');
                    expect(res.body).to.have.property('completed', false);
                    done();
                });
        });
    });

    describe('PUT /tasks/:id', () => {
        it('should update a task', (done) => {
            // First, create a new task to update
            chai.request(app)
                .post('/tasks')
                .send({ title: 'Task to Update' })
                .end((err, res) => {
                    const taskId = res.body.id;
                    chai.request(app)
                        .put(`/tasks/${taskId}`)
                        .send({ title: 'Updated Task', completed: true })
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property('title', 'Updated Task');
                            expect(res.body).to.have.property('completed', true);
                            done();
                        });
                });
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should delete a task', (done) => {
            // First, create a new task to delete
            chai.request(app)
                .post('/tasks')
                .send({ title: 'Task to Delete' })
                .end((err, res) => {
                    const taskId = res.body.id;
                    chai.request(app)
                        .delete(`/tasks/${taskId}`)
                        .end((err, res) => {
                            expect(res).to.have.status(204);
                            done();
                        });
                });
        });
    });
});
