import mysql      from "mysql2/promise"
import { format } from 'date-fns'

export class Products {
  static async all(dbConfig) {
    try {
      let msg = {
        status: false,
        msg: "Products not founded",
        code: 404
      }

      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection()

      let sql = `SELECT 
      sinv.codigo , sinv.descrip , sinv.precio1 as precioBs , FLOOR(sinv.existencia) as existencia , sinv.ccate,
      ROUND(detallepr.precio1, 2) as precioUsd,
      catego.ncate, marca.nmarca , sinv.marca
      FROM sinv 
      INNER JOIN detallepr ON sinv.codigo = detallepr.codigo
      INNER JOIN catego ON sinv.ccate = catego.ccate
      INNER JOIN marca ON sinv.marca = marca.cmarca
      WHERE sinv.existencia > 0
      ;`
      let [products] = await connection.execute(sql)
      
      connection.release()

      if(products.length > 0){

        msg = {
          status: true,
          msg: "Products found",
          code: 200,
          products
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }

  static async categories(dbConfig) {
    try {
      let msg = {
        status: false,
        msg: "Categories not founded",
        code: 404
      }

      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection()

      let sql = `SELECT ccate , ncate FROM catego;`
      let [categories] = await connection.execute(sql)
      
      connection.release()

      if(categories.length > 0){

        msg = {
          status: true,
          msg: "Categories found",
          code: 200,
          categories
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }

  static async brands(dbConfig) {
    try {
      let msg = {
        status: false,
        msg: "Brands not founded",
        code: 404
      }

      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection()

      let sql = `SELECT cmarca , nmarca FROM marca;`
      let [brands] = await connection.execute(sql)
      
      connection.release()

      if(brands.length > 0){

        msg = {
          status: true,
          msg: "Brands found",
          code: 200,
          brands
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }

  static async currency(dbConfig) {
    try {
      let msg = {
        status: false,
        msg: "Currency not founded",
        code: 404
      }

      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection()

      let sql = `SELECT moneda , cambio FROM tasamoneda;`
      let [currency] = await connection.execute(sql)
      
      connection.release()

      if(currency.length > 0){

        msg = {
          status: true,
          msg: "Currency found",
          code: 200,
          currency
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }

  static async company(dbConfig) {
    try {
      let msg = {
        status: false,
        msg: "Company not founded",
        code: 404
      }

      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection()

      let sql = `SELECT rif_emp , nom_emp , dir1_emp , noteOrder FROM empresa;`
      let [company] = await connection.execute(sql)
      
      connection.release()

      if(company.length > 0){

        msg = {
          status: true,
          msg: "company found",
          code: 200,
          company
        } 
      }
  
      return msg
    } catch (error) {
      return error
    }
  }

  static async orders(cod_ven, dbConfig) {
    try {
      const msg = {
        status: false,
        msg: "Error retrieving orders",
        code: 500
      };
  
      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection();
  
      // Query to get orders details
      const sqlPre = `
        SELECT 
          preorder.cod_order, 
          preorder.id_scli, 
          preorder.cod_cli, 
          scli.nom_cli, 
          scli.dir1_cli AS dir_cli,
          scli.tel_cli AS tlf_cli,
          preorder.tip_doc AS tipfac, 
          preorder.amountUsd AS totalUsd, 
          preorder.amountBs AS totalBs, 
          preorder.date_created AS fecha
        FROM preorder 
        JOIN scli ON preorder.id_scli = scli.id_scli 
        WHERE preorder.cod_ven = ?;
      `;
      const [preorders] = await connection.execute(sqlPre, [cod_ven]);
  
      // Query to get products for each order
      const sqlPro = `SELECT 
        cod_order, 
        codigo, 
        descrip, 
        quantity, 
        priceUsd, 
        priceBs 
      FROM prodorder 
      WHERE cod_ven = ?;`;
      const [prodorders] = await connection.execute(sqlPro, [cod_ven]);
  
      connection.release();
  
      const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd/MM/yyyy');
      };
  
      // Organize orders and products
      if (preorders.length > 0) {
        // Map orders with their products
        const orders = preorders.map(order => {
          // Filter products for the current order
          const products = prodorders.filter(product => product.cod_order === order.cod_order);
  
          return {
            id_order: order.cod_order,
            id_scli: order.id_scli,
            nom_cli: order.nom_cli,
            cod_cli: order.cod_cli,
            cod_ven: order.cod_ven,
            dir_cli: order.dir_cli,
            products: products.map(p => ({
              codigo: p.codigo,
              descrip: p.descrip,
              quantity: p.quantity,
              priceUsd: p.priceUsd,
              priceBs: p.priceBs
            })),
            tipfac: order.tipfac,
            tlf_cli: order.tlf_cli,
            totalBs: order.totalBs,
            totalUsd: order.totalUsd,
            fecha: formatDate(order.fecha)
          };
        });
  
        return {
          status: true,
          msg: "Orders found",
          code: 200,
          orders
        };
      } else {
        // Return a 200 status with a message indicating no orders
        return {
          status: true,
          msg: "No orders found",
          code: 200,
          orders: []
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: "Error retrieving orders",
        code: 500,
        error: error.message
      };
    }
  }

  static async visits(cod_ven, dbConfig) {
    try {
      const msg = {
        status: false,
        msg: "Error retrieving visits",
        code: 500
      }
  
      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection()
  
      // Query to get visit details
      const sqlVisits = `
        SELECT 
          visits.id_visit,
          visits.cod_visit,
          visits.id_scli, 
          visits.cod_cli, 
          visits.nom_cli,
          visits.type_visit,
          visits.date_created AS fecha
        FROM visits 
        WHERE visits.cod_ven = ?;
      `
      const [visitsClient] = await connection.execute(sqlVisits, [cod_ven])
  
      connection.release()
  
      const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd/MM/yyyy')
      }
  
      // Organize visits data
      if (visitsClient.length > 0) {
        const visits = visitsClient.map(visit => ({
          id_visit: visit.cod_visit,
          id_scli: visit.id_scli,
          cod_cli: visit.cod_cli,
          nom_cli: visit.nom_cli,
          type_visit: visit.type_visit,
          fecha: formatDate(visit.fecha)
        }))
  
        return {
          status: true,
          msg: "Visits found",
          code: 200,
          visits
        }
      } else {
        // Return a 200 status with a message indicating no visits
        return {
          status: true,
          msg: "No visits found",
          code: 200,
          visits: []
        }
      }
    } catch (error) {
      return {
        status: false,
        msg: "Error retrieving visits",
        code: 500,
        error: error.message
      }
    }
  }

  static async payments(cod_ven, dbConfig) {
    try {
      const msg = {
        status: false,
        msg: "Error retrieving payments",
        code: 500
      };
  
      const pool = mysql.createPool(dbConfig)
      const connection = await pool.getConnection();
  
      const sqlPayments = ` 
        SELECT 
          id_pass, 
          identifier, 
          id_scli, 
          cod_cli, 
          nom_cli, 
          cod_ven, 
          amount, 
          currency_type, 
          currency_rate, 
          date_created AS fecha 
        FROM pass 
        WHERE cod_ven = ?;
      `;
      const [paymentsClient] = await connection.execute(sqlPayments, [cod_ven]);
  
      connection.release();
  
      const formatDate = (dateString) => {
        return format(new Date(dateString), 'dd/MM/yyyy');
      };
  
      // Organize payments data
      if (paymentsClient.length > 0) {
        const payments = paymentsClient.map(payment => ({
          id_pass: payment.id_pass,
          identifier: payment.identifier,
          id_scli: payment.id_scli,
          cod_cli: payment.cod_cli,
          nom_cli: payment.nom_cli,
          cod_ven: payment.cod_ven,
          amount: payment.amount,
          currency_type: payment.currency_type,
          currency_rate: payment.currency_rate,
          fecha: formatDate(payment.fecha)
        }));
  
        return {
          status: true,
          msg: "Payments found",
          code: 200,
          payments
        };
      } else {
        // Return a 200 status with a message indicating no payments
        return {
          status: true,
          msg: "No payments found",
          code: 200,
          payments: []
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: "Error retrieving payments",
        code: 500,
        error: error.message
      };
    }
  }

}

