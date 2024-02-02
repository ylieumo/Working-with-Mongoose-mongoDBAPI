import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import Grade from '../models/grades.mjs'

const router = express.Router();

// Create a single grade entry
router.post("/", async (req, res) => {
  let collection = await db.collection("grades");
  let newDocument = req.body;

  // rename fields for backwards compatibility
  if (newDocument.student_id) {
    newDocument.learner_id = newDocument.student_id;
    delete newDocument.student_id;
  }

  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});


// Get a single grade entry thru mongoose
router.get("/:id", async (req, res) => {
    let foundGrade = await Grade.findById(req.params.id)
    res.status(200).json({
      data: foundGrade
    })
})

// Get a single grade entry thru mongodb
// router.get("/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { _id: new ObjectId(req.params.id) };
//   let result = await collection.findOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });-

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { _id: new ObjectId(req.params.id) };

  let result = await collection.updateOne(query, {
    $push: { scores: req.body },
  });

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { _id: new ObjectId(req.params.id) };

  let result = await collection.updateOne(query, {
    $pull: { scores: req.body },
  });

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// // Delete a single grade entry/mongodb
// router.delete("/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { _id: new ObjectId(req.params.id) };
//   let result = await collection.deleteOne(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

router.delete('/:id', async (req, res, next) => {
    const data = await Grade.findByIdAndDelete(req.params.id);
  
      if(!data) {
        return res.status(404).json({
             status: “fail”,
             data: {
                 message: “Not found”
              }
          })
      }
  
    return res.status(204).json({
           status: “success”,
           data: null;
      })
  })

// Update a single grade entry/mongoose
router.patch("/:id", async (req, res) => {
    const updatedGrade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGrade) {
        return res.status(404).json({ error: 'Grade not found' });
    }
    res.status(200).json(updatedGrade);
});

// router found for 50 grades/mongoose 
router.get('/', async (req, res) =>{
    let foundGrades = await Grade.find().limit(50)
    res.status(200).json({
        foundGrades:foundGrades
    })

})

// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
  res.redirect(`learner/${req.params.id}`);
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { learner_id: Number(req.params.id) };

  // Check for class_id parameter
  if (req.query.class) query.class_id = Number(req.query.class);

  let result = await collection.find(query).toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { learner_id: Number(req.params.id) };

  let result = await collection.deleteOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Get a class's grade data
router.get("/class/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { class_id: Number(req.params.id) };

  // Check for learner_id parameter
  if (req.query.learner) query.learner_id = Number(req.query.learner);

  let result = await collection.find(query).toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});


// // Update a class id
// router.patch("/class/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { class_id: Number(req.params.id) };

//   let result = await collection.updateMany(query, {
//     $set: { class_id: req.body.class_id },
//   });

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });


// // Delete a class
// router.delete("/class/:id", async (req, res) => {
//   let collection = await db.collection("grades");
//   let query = { class_id: Number(req.params.id) };

//   let result = await collection.deleteMany(query);

//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });




export default router;
