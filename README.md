# MagicMirror Module: MMM-corona-dresden 
forked from tonimoeckel/MMM-corona-dresden and adapted for Braunschweig.


### The module displays the following information:

Für die Stadt Braunschweig
* Fälle gesamt
* Zahl der derzeit angesteckten Personen
* Zahl der Toten
* Inzidenz inkl. Chart

![screenshot](https://github.com/TimoBS/MMM-corona-dresden/blob/main/screenshot/screen.png)


### Data Source
https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=&objectIds=17&outFields=OBJECTID,death_rate,cases,deaths,cases_per_100k,cases_per_population,county,last_update,cases7_per_100k,recovered,cases7_bl_per_100k&outSR=4326&f=json


## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/TimoBS/MMM-corona-dresden
````


Configure the module in your `config.js` file.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
    {
        module: "MMM-corona-dresden",
        position: "top_left",
        header: "Corona Braunschweig",
        config: {
            
        }
    },
]
````
