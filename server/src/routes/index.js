const express = require('express');

const admissionRoutes = require('./admission.routes');
const appointmentRoutes = require('./appointment.routes');
const authRoutes = require('./auth.routes');
const cabinRoutes = require('./cabin.routes');
const doctorRoutes = require('./doctor.routes');
const employeeRoutes = require('./employee.routes');
const leaveRoutes = require('./leave.routes');
const lookupRoutes = require('./lookup.routes');
const notificationRoutes = require('./notification.routes');
const nurseRoutes = require('./nurse.routes');
const patientRoutes = require('./patient.routes');
const wardRoutes = require('./ward.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'health-harbor-api' });
});

router.use(authRoutes);
router.use(lookupRoutes);
router.use(patientRoutes);
router.use(doctorRoutes);
router.use(appointmentRoutes);
router.use(notificationRoutes);
router.use(leaveRoutes);
router.use(admissionRoutes);
router.use(wardRoutes);
router.use(cabinRoutes);
router.use(nurseRoutes);
router.use(employeeRoutes);

module.exports = router;
