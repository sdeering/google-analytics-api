<?php
session_start();
require_once 'src/Google_Client.php';
require_once 'src/contrib/Google_AnalyticsService.php';

$scriptUri = "http://".$_SERVER["HTTP_HOST"].$_SERVER['PHP_SELF'];

$client = new Google_Client();
$client->setAccessType('online'); // default: offline
$client->setApplicationName('jquery4u');
$client->setClientId('');
$client->setClientSecret('');
$client->setRedirectUri($scriptUri);
$client->setDeveloperKey(''); // API key

// $service implements the client interface, has to be set before auth call
$service = new Google_AnalyticsService($client);

if (isset($_GET['logout'])) { // logout: destroy token
    unset($_SESSION['token']);
    die('Logged out.');
}

if (isset($_GET['code'])) { // we received the positive auth callback, get the token and store it in session
    $client->authenticate();
    $_SESSION['token'] = $client->getAccessToken();
}

if (isset($_SESSION['token'])) { // extract token from session and configure client
    $token = $_SESSION['token'];
    $client->setAccessToken($token);
}

if (!$client->getAccessToken()) { // auth call to google
    $authUrl = $client->createAuthUrl();
    header("Location: ".$authUrl);
    die;
}

try {

    //specific project: jquery4u.com
    $projectId = '37817190';

    // metrics
    $_params[] = 'date';
    $_params[] = 'date_year';
    $_params[] = 'date_month';
    $_params[] = 'date_day';
    // dimensions
    $_params[] = 'visits';
    $_params[] = 'pageviews';

    // $from = date('Y-m-d', time()-2*24*60*60); // 2 days ago
    // $from = date('Y-m-d', time()-5*24*60*60); // 5 days ago
    $from = date('Y-m-d', time()-7*24*60*60); // 7 days ago
    $to = date('Y-m-d', time()-24*60*60); // 1 days ago
    // $to = date('Y-m-d'); // today

    $metrics = 'ga:visits,ga:pageviews,ga:bounces,ga:entranceBounceRate,ga:visitBounceRate,ga:avgTimeOnSite';
    $dimensions = 'ga:date,ga:year,ga:month,ga:day';
    $data = $service->data_ga->get('ga:'.$projectId, $from, $to, $metrics, array('dimensions' => $dimensions));

    // echo "<strong>Project: jquery4u.com (".$projectId.')</strong><br/>';
    // foreach($data['rows'] as $row) {
    //    $dataRow = array();
    //    foreach($_params as $colNr => $column)
    //    {
    //        echo $column . ': '.$row[$colNr].'<br/>';
    //    }
    // }

    $retData = array();
    foreach($data['rows'] as $row)
    {
       $dataRow = array();
       foreach($_params as $colNr => $column)
       {
           $dataRow[$column] = $row[$colNr];
       }
       array_push($retData, $dataRow);
    }
    // var_dump($retData);
    echo json_encode($retData);


} catch (Exception $e) {
    die('An error occured: ' . $e->getMessage()."\n");
}
?>