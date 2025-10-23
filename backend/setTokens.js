

export function setToken(user, res, jwt) {

    const SESSION_DURATION_SECONDS = 60 * 60 * 24; // 1 day

    const token = jwt.sign(
        { userId: user.id, firstName: user.firstname, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: SESSION_DURATION_SECONDS }
    );

    res.cookie('authToken', token, {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,   // process.env.NODE_ENV === 'production',
        maxAge: SESSION_DURATION_SECONDS * 1000
    });


/* 
    const tripToken = JSON.stringify({ currentTripId: 9 });

    res.cookie('currentTripToken', tripToken, {
        httpOnly: false,
        sameSite: 'none',
        path: '/',
        secure: true
    }); */
}

