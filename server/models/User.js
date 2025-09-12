const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    university: {
        type: String,
        required: [true, 'University/College name is required'],
        trim: true,
        maxlength: [200, 'University name cannot exceed 200 characters']
    },
    academicYear: {
        type: String,
        required: [true, 'Academic year is required'],
        enum: [
            '1st Year',
            '2nd Year', 
            '3rd Year',
            '4th Year',
            '5th Year',
            'Masters Student',
            'PhD Student'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    profile: {
        bio: String,
        interests: [String],
        joinedCommunities: [String]
    },
    settings: {
        isAnonymous: {
            type: Boolean,
            default: false
        },
        notifications: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpires;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);
