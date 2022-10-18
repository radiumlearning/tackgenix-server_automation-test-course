import mongoose from 'mongoose';
import Admins from '../models/Admins';

const deleteAdmins = async (req, res) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({
      message: 'id invalid',
      data: undefined,
      error: true,
    });
  }
  try {
    const { id } = req.params;
    const deleteAdmin = await Admins.findByIdAndDelete(id);

    if (deleteAdmin) {
      return res.status(200).json({
        message: 'Admin deleted successfully',
        data: deleteAdmin,
        error: false,
      });
    }
    return res.status(404).json({
      message: `Admin with id ${id} not found`,
      data: undefined,
      error: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error ${err}`,
      data: undefined,
      error: true,
    });
  }
};

const updateAdmins = async (req, res) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({
      message: 'id invalid',
      data: undefined,
      error: true,
    });
  }
  try {
    const { id } = req.params;
    const updateAdmin = await Admins.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true },
    );
    if (updateAdmin) {
      return res.status(200).json({
        message: `Admin with id ${id} updated successfully`,
        data: updateAdmin,
        error: false,
      });
    }
    return res.status(404).json({
      message: `Admin with id ${id} not found`,
      data: undefined,
      error: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error ${err}`,
      data: undefined,
      error: true,
    });
  }
};

export default { deleteAdmins, updateAdmins };
