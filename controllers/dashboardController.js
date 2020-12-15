const Flash = require('../utils/Flash')
const Profile = require('../models/Profile')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter')

exports.dashboardGetController = async (req, res, next) => {

    try {
        let profile = await Profile.findOne({
            user: req.user._id
        })

        if (profile) {
            return res.render('pages/dashboard/dashboard', {
                title: 'My DashBoard',
                flashMessage: Flash.getMessage(req)
            })
        }
        res.redirect('/dashboard/create-profile')

    } catch (e) {
        next(e)
    }

    res.render('pages/dashboard/dashboard',
        {
            title: "MyDashBoard",
            flashMessage: Flash.getMessage(req)
        })
}


exports.createProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })
        if (profile) {
            return res.redirect('/dashboard/edit-profile')
        }

        res.render('pages/dashboard/create-profile',
            {
                title: 'Create Your Profile',
                flashMessage: Flash.getMessage(req),
                error: {}
            })
    } catch (e) {
        next(e)
    }
}

exports.createProfilePostController = async (req, res, next) => {

    let error = validationResult(req)
    const formatter = (error) => error.msg
    let errors = error.formatWith(formatter)

    //let errors = validationResult(req).formatWith(errorFormatter)
    console.log(errors.mapped())

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile',
            {
                title: 'Create Your Profile',
                flashMessage: Flash.getMessage(req),
                error: errors.mapped()
            })
    }



    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
    } = req.body

    try {
        let profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            profilePic: req.user.profilePic,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || ''
            },
            posts: [],
            bookmarks: []
        })

        let createProfile = await profile.save()
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { profile: createProfile._id } }
        )

        req.flash('success', 'Profile created Successfully')
        res.redirect('/dashboard')

    } catch (e) {

    }

}

exports.editProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })
        if (!profile) {
            return res.redirect('/dashboard/create-profile')
        }

        res.render('pages/dashboard/edit-profile', {
            title: 'Edit your Profile',
            error: {},
            flashMessage: Flash.getMessage(req),
            profile
        })

    } catch (e) {
        next(e)
    }
}

exports.editProfilePostController = async (req, res, next) => {

    let error = validationResult(req)
    const formatter = (error) => error.msg
    let errors = error.formatWith(formatter)


    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
    } = req.body


    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile',
            {
                title: 'Create Your Profile',
                flashMessage: Flash.getMessage(req),
                error: errors.mapped(),
                profile: {
                    name,
                    title,
                    bio,
                    profilePic: req.user.profilePic,
                    links: {
                        website: website || '',
                        facebook: facebook || '',
                        twitter: twitter || '',
                        github: github || ''
                    }
                }
            })
    }


    try {
        let profile = {
            name,
            title,
            bio,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || ''
            }
        }

        let updateProfile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: profile },
            { new: true }
        )
        req.flash('success', 'Profile Updated Successfully')

        res.render('pages/dashboard/edit-profile', {
            title: 'Edit your Profile',
            error: {},
            flashMessage: Flash.getMessage(req),
            profile: updateProfile
        })

    } catch (e) {

    }
}