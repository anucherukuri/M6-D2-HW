import {Router} from 'express';
import pool from '../../utils/db.js';

const productsRouter = Router();

//TO GET ALL THE PRODUCTS
productsRouter.get('/', async(req, res, next) => {
try{
const data = await pool.query("SELECT * FROM product;");
res.send(data.rows);
}catch(error){
res.status(500).send({message: error.message});
}
});

//TO SEARCH FOR A PARTICULAR PRODUCT
productsRouter.get('/search', async(req, res, next) => {
    try{
    const data = await pool.query(
        "SELECT * FROM product WHERE name ILIKE $1;",
        [`%${req.query.query || ""}%`]
        );
        res.send(data.rows);
    }catch(error){
        res.status(500).send({message: error.message});
    }
});

//TO GET SINGLE PRODUCT by id
productsRouter.get("/:id", async (req, res, next) => {
    try {
      const data = await pool.query("SELECT * FROM product WHERE product_id=$1", [
        req.params.id,
      ]);
      const product = data.rows[0];
      if (product) {
        res.send(product);
      } else {
        res.status(404).send({ message: "Product is not found" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  

  //TO POST A SINGLE PRODUCT
  productsRouter.post("/", async (req, res, next) => {
    try {
      const data = await pool.query(
        "INSERT INTO product(name, description, brand, url, price, category ) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;", //
        Object.values(req.body)
      );
      const product = data.rows[0];
      res.status(201).send(product);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  

  //TO DELETE A PARTICULAR PRODUCT by id
  productsRouter.delete("/:id", async (req, res, next) => {
    try {
      await pool.query("DELETE FROM product_category WHERE product=$1;", [
        req.params.id,
      ]);
      const data = await pool.query("DELETE FROM product WHERE product_id=$1;", [
        req.params.id,
      ]);
  
      const isDeleted = data.rowCount > 0;
      if (isDeleted) {
        res.status(204).send();
      } else {
        res.status(404).send({
          message: "Product not found therefore there is nothing to done.",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
  
  //TO EDIT A PARTICULAR PRODUCT DETAILS
  productsRouter.put("/:id", async (req, res, next) => {
    try {
      const data = await pool.query(
        "UPDATE product SET name=$1,image=$2,price=$3 WHERE product_id=$4 RETURNING *;",
        [req.body.name, req.body.image, req.body.price, req.params.id]
      );
  
      const isUpdated = data.rowCount > 0;
      if (isUpdated) {
        res.status(200).send(data.rows[0]);
      } else {
        res.status(404).send({
          message: "Product not found therefore there is nothing to done.",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

  export default productsRouter;