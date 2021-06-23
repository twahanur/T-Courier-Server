const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://ThohanurRahman:Thohanur@cluster0.566ly.mongodb.net/T-Courier?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err);
    const serviceCollection = client.db("T-Courier").collection("Services");
    const bookedCollection = client.db("T-Courier").collection("Booked-Service");
    const adminCollection = client.db("T-Courier").collection("Admin");
    const reviewsCollection = client.db("T-Courier").collection("Reviews");
    const usersCollection = client.db("T-Courier").collection("Users");

    // Authentication varifivation
        app.get('/verify-email-address', (req, res) => {
            const verifyUserEmail = req.query.email;
            usersCollection.find({ email: verifyUserEmail })
                .toArray((err, data) => {
                    console.log('Eita ami', data)
                    res.send(data)
                })
        });


 
//  Adding code starts from here
            // Create User Automatically if new and Save on DB
            app.post('/addNewUser', (req, res) => {
                console.log(req.body)
                const newUserDetails = req.body;
                usersCollection.insertOne(newUserDetails)
                    .then(result => {
                        res.send(result.insertedCount > 0)
                    })
            });
 

            // add a service
            app.post('/addService', (req, res) => {
                const newService = req.body;
                serviceCollection.insertOne(newService)
                    .then(result => {
                        res.send(result.insertedCount > 0)
                    })
            });

            // add a order
            app.post('/addBooking', (req, res) => {
                const service = req.body;
                bookedCollection.insertOne(service)
                    .then(result => {
                        res.send(result.insertedCount > 0)
                    })
            });

            // add a admine
            app.post('/addAdmin', (req, res) => {
                const makeAdmin = req.body;
                adminCollection.insertOne(makeAdmin)
                    .then(admin => {
                        res.send(admin.insertedCount > 0);
                    })
            })

            // Save Review on database
            app.post('/addReview', (req, res) => {
                const newService = req.body;
                reviewsCollection.insertOne(newService)
                    .then(result => {
                        res.send(result.insertedCount > 0)
                    })
            });

// Adding code ends here





// Show data from data base code starts from here

            // show all service
            app.get('/services', (req, res) => {
                serviceCollection.find()
                    .toArray((err, items) => {
                        res.send(items);
                    })
            });

            // Get services from Database using ID
            app.get('/services/:id', (req, res) => {
                const id = ObjectID(req.params.id);
                serviceCollection.find({ _id: id })
                    .toArray((err, product) => {
                        res.send(product);
                    })
            });


            app.post('/isAdmin', (req, res) => {
                const email = req.body.email;
                adminCollection.find({ email:email })
                    .toArray((err, admin) => {
                        res.send(admin.length > 0);
                    })
            })
            // Confirm services and Save services Details To Database
            app.post('/confirmService', (req, res) => {
                const newOrder = req.body;
                bookedCollection.insertOne(newOrder)
                    .then(result => {
                        res.send(result.insertedCount > 0);
                    })
            });

            // Load Products Base On User Email Address
            app.get('/services', (req, res) => {
                const queryEmail = req.query.useremail;
                bookedCollection.find({ useremail: queryEmail })
                    .toArray((err, product) => {
                        res.send(product);
                    })
            })

            // Find Product using id and Delete Product from Database
            app.delete('/deleteProduct/:id', (req, res) => {
                const id = ObjectID(req.params.id);
                serviceCollection.deleteOne({ _id: id })
                    .then(result => {
                        res.send(result.deletedCount > 0)
                    })
            });

            // Get Review from database
            app.get('/reviews', (req, res) => {
                reviewsCollection.find()
                    .toArray((err, items) => {
                        res.send(items);
                    })
            });

            // Update order status
            app.patch('/confirmService/:id', (req, res) => {
                bookedCollection.updateOne({ _id: ObjectID(req.params.id) },
                    {
                        $set: { status: req.body.updatedStatus }
                    })
                    .then(result => {
                        res.send(result.modifiedCount > 0);
                    })
            });


                // Get Order Details from Database
                app.get('/orders', (req, res) => {
                    bookedCollection.find()
                        .toArray((err, data) => {
                            console.log('Ei Id er order', data)
                            res.send(data)
                        })
                });

            // Delete a service
            app.delete('/manageService/:id', (req, res) => {
                const id = ObjectID(req.params.id);
                servicesCollection.deleteOne({ _id: id })
                    .then(result => {
                        res.send(result.deletedCount > 0);
                    })
            });

}
)
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})