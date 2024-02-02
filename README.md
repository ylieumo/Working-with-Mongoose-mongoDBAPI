GET route that sends grade data by _id.
GET route that sends all data for a specified student_id.
GET route that sends all data for a specified class_id.
GET route that sends the data for a specified combination of student_id and class_id.
GET route that sends the weighted average score for each class for a student.
GET route that sends the overall weighted average score for a student.
POST route to create new grade documents.
PATCH routes to update the scores array.
Add a new score.
Remove a score.
PATCH route to update class_id.
DELETE route to remove a single grade entry.
DELETE route to remove all of a student's entries.
DELETE route to remove all of a class's entries.
modified the files(using mongoose intead of mondb to acess the db ).