require('dotenv').config()

const express = require('express');
const app = express();
const port = process.env.PORT;
const db = require('./db');

const initDatabase = async () => {
    try {
        await db.table.sync({ alter: true });
        console.log('\x1b[36m%s\x1b[0m', 'Adatbázis csatlakozás sikeres!');
    } catch (error) {
        console.error(`Hiba történt az adatbázis csatlakozáskor: ${error.message}`);
        console.log("Az adatbázis jelenleg nem elérhető, az alkalmazás folytatja a futást adatbázis nélkül.");
    }
};

initDatabase();

app.use(express.static('public'));
app.use(express.json());

// Adatok lekérése
app.get('/datas', async (req, res) => {
    try {
        const data = await db.table.findAll();
        res.json(data);
    } catch (error) {
        console.error(`Hiba történt az adatok lekérésnél: ${error.message}`);
        res.status(500).send("Hiba történt az adatok lekérésénél");
    }
});

// Új adat hozzáadása
app.post('/datas', async (req, res) => {
    try {
        const newData = await db.table.create({
            name: req.body.name,
            number: req.body.number,
        });
        res.json(newData);
    } catch (error) {
        console.error(`Hiba történt az adatok feltöltésénél: ${error.message}`);
        res.status(500).send("Hiba történt az adatok feltöltésénél");
    }
});

// Adat törlése
app.delete('/datas/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db.table.destroy({ where: { id } });
        res.status(200).send('Data deleted');
    } catch (error) {
        console.error(`Hiba történt az adat törlésénél: ${error.message}`);
        res.status(500).send("Hiba történt az adat törlésénél");
    }
});

// Adat szerkesztése
app.put('/datas/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, number } = req.body;

        await db.table.update({ name, number }, { where: { id } });
        res.status(200).send('Data updated');
    } catch (error) {
        console.error(`Hiba történt az adat módosításánál: ${error.message}`);
        res.status(500).send("Hiba történt az adat módosításánál");
    }
});

app.get('/users/count', async (req, res) => {
    try {
        const userCount = await db.table.count();
        res.json(userCount);
    } catch (error) {
        console.error(`Hiba történt a felhasználók számának lekérésekor: ${error.message}`);
        res.status(500).send("Hiba történt a felhasználók számának lekérésekor");
    }
});
// Adatok számának lekérése
app.get('/datas/count', async (req, res) => {
    try {
        const dataCount = await db.table.count();
        res.json(dataCount);
    } catch (error) {
        console.error(`Hiba történt az adatok számának lekérésekor: ${error.message}`);
        res.status(500).send("Hiba történt az adatok számának lekérésekor");
    }
});

// Legrégebbi felhasználó lekérdezése
app.get('/users/oldest', async (req, res) => {
    try {
        const oldestUser = await db.table.findOne({
            order: [['createdAt', 'ASC']], // Legrégebbi rekord első helyre rendezése
            attributes: ['name', 'createdAt'] // Csak a név és létrehozás dátuma
        });

        if (oldestUser) {
            res.json({
                name: oldestUser.name,
                createdAt: oldestUser.createdAt
            });
        } else {
            res.status(404).send("Nem található felhasználó");
        }
    } catch (error) {
        console.error(`Hiba a legrégebbi felhasználó lekérésekor: ${error.message}`);
        res.status(500).send("Hiba történt a legrégebbi felhasználó lekérésekor");
    }
});

app.get('/users/newest', async (req, res) => {
    try {
        const newEst = await db.table.findOne({
            order: [['createdAt', 'DESC']], 
            attributes: ['name', 'createdAt'] // Csak a név és létrehozás dátuma
        });

        if (newEst) {
            res.json({
                name: newEst.name,
                createdAt: newEst.createdAt
            });
        } else {
            res.status(404).send("Nem található felhasználó");
        }
    } catch (error) {
        console.error(`Hiba a legújabb felhasználó lekérésekor: ${error.message}`);
        res.status(500).send("Hiba történt a legújabb felhasználó lekérésekor");
    }
});
app.listen(port, () => console.log('\x1b[36m%s\x1b[0m', `Listening on: ${port}`));