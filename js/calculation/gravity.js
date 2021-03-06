import { gravityToPlato, gravityIsInRange, getGravityPoints } from '../helpers/gravity';
import { formatAsFloat, formatNumber  } from "../helpers/format";
import { gravityHasProgress, validateGravity } from "../validations/gravity";

export const calculateAttenuation = (beginValue, endValue ) => {
    beginValue = formatAsFloat( beginValue );
    endValue   = formatAsFloat( endValue );

    if ( ! gravityHasProgress( beginValue, endValue ) ) {
        return '';
    }

    let result = Math.round( ( ( beginValue - endValue ) / ( beginValue - 1000 ) ) * 100 );

    if ( isNaN( result ) ) {
        return '';
    }

    return formatNumber( result ) + '%';
};

export const calculateGravityCorrection = ( volume, gravity, target_gravity ) => {
    volume         = formatAsFloat( volume );
    gravity        = formatAsFloat( gravity );
    target_gravity = formatAsFloat( target_gravity );

    if ( volume === '' || volume < 1 || gravity === '' || target_gravity === '' ) {
        return '';
    }

    if ( ! gravityIsInRange( gravity ) || ! gravityIsInRange( target_gravity ) ) {
        return '';
    }

    let current_gravity        = getGravityPoints( gravity );
    let current_target_gravity = getGravityPoints( target_gravity );

    if ( current_gravity < current_target_gravity ) {
        let result = volume * ( current_target_gravity - current_gravity ) * 2.604;
        if ( ! isNaN( result ) && result !== '' ) {
            return "Voeg " + Math.round( result ) + " gram suiker toe om het SG te verhogen.";
        }
    }

    if ( current_gravity > current_target_gravity ) {
        let result =  ( volume * current_gravity ) / current_target_gravity;
        if ( ! isNaN( result ) && result !== '' ) {
            return "Voeg " + ( formatNumber( result - volume ) ) + " liter water toe om het SG te verlagen.";
        }
    }

    return "Het SG komt overeen met het doel SG.";
};

export const calculateFinalGravity = ( gravity, attenuation ) => {
    gravity     = formatAsFloat( gravity );
    attenuation = formatAsFloat( attenuation );

    if( ! validateGravity( gravity ) ) {
        return '';
    }

    if( attenuation < 0 || attenuation > 100 ) {
        return '';
    }

    let result = gravity - ( ( getGravityPoints( gravity ) / 100 ) * 81 );

    if ( isNaN( result ) || result > 50 ) {
        return '';
    }

    return formatNumber( result );
};

export const convertGravityPlato = function( gravity ) {
    gravity = formatAsFloat( gravity );

    if ( ! validateGravity( gravity ) ) {
        return '';
    }

    let result = gravityToPlato( gravity );
    if( isNaN( result ) ) {
        return '';
    }

    return result + '°Plato';
};

