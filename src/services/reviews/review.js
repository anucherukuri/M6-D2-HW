import {Router} from 'express';
import pool from '../../utils/db.js';

const reviewsRouter = Router();

//TO GET ALL THE REVIEWS
reviewsRouter.get('/', async(req, res, next) => {
try{
const data = await pool.query("SELECT * FROM review;");
res.send(data.rows);
}catch(error){
res.status(500).send({message: error.message});
}
});

//TO SEARCH FOR A PARTICULAR REVIEW
reviewsRouter.get('/search', async(req, res, next) => {
    try{
    const data = await pool.query(
        "SELECT * FROM review WHERE name ILIKE $1;",
        [`%${req.query.query || ""}%`]
        );
        res.send(data.rows);
    }catch(error){
        res.status(500).send({message: error.message});
    }
});

//TO GET SINGLE REVIEW by id
reviewsRouter.get("/:id", async (req, res, next) => {
    try {
      const data = await pool.query("SELECT * FROM review WHERE review_id=$1", [
        req.params.id,
      ]);
      const review = data.rows[0];
      if (review) {
        res.send(review);
      } else {
        res.status(404).send({ message: "review is not found" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  

  //TO POST A SINGLE REVIEW
  reviewsRouter.post("/", async (req, res, next) => {
    try {
      const data = await pool.query(
        "INSERT INTO review(name,price) VALUES($1,$2) RETURNING *;", //
        Object.values(req.body)
      );
      const review = data.rows[0];
      res.status(201).send(review);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  

  //TO DELETE A PARTICULAR REVIEW by id
  reviewsRouter.delete("/:id", async (req, res, next) => {
    try {
      await pool.query("DELETE FROM review_category WHERE review=$1;", [
        req.params.id,
      ]);
      const data = await pool.query("DELETE FROM review WHERE review_id=$1;", [
        req.params.id,
      ]);
  
      const isDeleted = data.rowCount > 0;
      if (isDeleted) {
        res.status(204).send();
      } else {
        res.status(404).send({
          message: "review not found therefore there is nothing to done.",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  
  //TO EDIT A PARTICULAR REVIEW DETAILS
  reviewsRouter.put("/:id", async (req, res, next) => {
    try {
      const data = await pool.query(
        "UPDATE review SET name=$1,image=$2,price=$3 WHERE review_id=$4 RETURNING *;",
        [req.body.name, req.body.image, req.body.price, req.params.id]
      );
  
      const isUpdated = data.rowCount > 0;
      if (isUpdated) {
        res.status(200).send(data.rows[0]);
      } else {
        res.status(404).send({
          message: "review not found therefore there is nothing to done.",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

  export default reviewsRouter;