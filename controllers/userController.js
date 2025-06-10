import User from '../models/User.js';

export const getSkillMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        const normalize = arr => arr?.map(s => s.trim().toLowerCase()) || [];

        const teachSkills = normalize(currentUser.skills);
        const learnSkills = normalize(currentUser.interests);

        const allUsers = await User.find({ _id: { $ne: currentUser._id } });

        const matches = allUsers.filter(user => {
            const theirSkills = normalize(user.skills);
            const theirInterests = normalize(user.interests);

            const theyCanTeachMe = theirSkills.some(skill => learnSkills.includes(skill));
            const theyWantMySkill = theirInterests.some(interest => teachSkills.includes(interest));

            return theyCanTeachMe && theyWantMySkill;
        });

        res.json(matches.map(u => ({
            _id: u._id,
            fullname: u.fullname,
            skills: u.skills,
            interests: u.interests,
            experienceLevel: u.experienceLevel,
            experienceSummary: u.experienceSummary
        })));

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const wantToLearnProfile = async(req,res)=>{
    try {
        const currentUser = await User.findById(req.user._id);
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        const normalize = arr => arr?.map(s => s.trim().toLowerCase()) || [];

        const teachSkills = normalize(currentUser.skills);
        const learnSkills = normalize(currentUser.interests);

        const allUsers = await User.find({ _id: { $ne: currentUser._id } });

        const matches = allUsers.filter(user => {
            const theirSkills = normalize(user.skills);
            const theirInterests = normalize(user.interests);

            const theyCanTeachMe = theirSkills.some(skill => learnSkills.includes(skill));
            // const theyWantMySkill = theirInterests.some(interest => teachSkills.includes(interest));

            return theyCanTeachMe;
        });

        res.json(matches.map(u => ({
            _id: u._id,
            fullname: u.fullname,
            skills: u.skills,
            interests: u.interests,
            experienceLevel: u.experienceLevel,
            experienceSummary: u.experienceSummary
        })));

    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
}