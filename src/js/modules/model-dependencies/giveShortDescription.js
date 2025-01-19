function giveShortDescription(weathercode) {
        weathercode = String(weathercode)
        let shortDesc = ''
        switch (weathercode) {
            case '0':
                shortDesc = 'Clear'
                break;
            case '1':
            case '2':
            case '3':
                shortDesc = 'Cloudy'
                break;
            case '45':
            case '48':
                shortDesc = 'Foggy'
                break;
            case '51':
            case '53':
            case '55':
            case '56':
            case '57':
                shortDesc = 'Drizzle'
                break;
            case '61':
            case '63':
            case '65':
            case '66':
            case '67':
            case '80':
            case '81':
            case '82':
                shortDesc = 'Rain'
                break;
            case '71':
            case '73':
            case '75':
            case '77':
            case '85':
            case '86':
                shortDesc = 'Snow'
                break;
            case '95':
            case '96':
            case '99':
                shortDesc = 'Thunder'
                break;
            default:
                shortDesc = ''
                break;
        }
        return shortDesc
    }

export default giveShortDescription